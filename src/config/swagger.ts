const bearer = [{ bearerAuth: [] }];
const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } };

export const swaggerSpec = {
  openapi: '3.0.3',
  info: { title: 'EMS API', version: '1.0.0', description: 'Employee Management System' },
  servers: [{ url: 'http://localhost:4000' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      EmployeeInput: {
        type: 'object',
        required: ['employeeCode', 'firstName', 'lastName', 'email', 'dateOfJoining', 'salary', 'departmentId', 'designationId'],
        properties: {
          employeeCode: { type: 'string', example: 'EMP001' },
          firstName: { type: 'string', example: 'Asha' },
          lastName: { type: 'string', example: 'Nair' },
          email: { type: 'string', example: 'asha@ems.com' },
          phone: { type: 'string', example: '9876543210' },
          dateOfJoining: { type: 'string', format: 'date', example: '2025-01-15' },
          salary: { type: 'number', example: 60000 },
          departmentId: { type: 'integer', example: 1 },
          designationId: { type: 'integer', example: 1 },
          managerId: { type: 'string', format: 'uuid' },
        },
      },
    },
  },
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Login',
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object', properties: { email: { type: 'string', example: 'admin@ems.com' }, password: { type: 'string', example: 'Admin@123' } },
        } } } },
        responses: { 200: { description: 'Tokens and user' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'], summary: 'Rotate refresh token',
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object', properties: { refreshToken: { type: 'string' } },
        } } } },
        responses: { 200: { description: 'New token pair' }, 401: { description: 'Invalid token' } },
      },
    },
    '/api/employees': {
      get: {
        tags: ['Employees'], summary: 'List employees (paginated)', security: bearer,
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'departmentId', in: 'query', schema: { type: 'integer' } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['firstName', 'lastName', 'email', 'dateOfJoining', 'salary', 'createdAt'] } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: { 200: { description: 'Employees with pagination meta' } },
      },
      post: {
        tags: ['Employees'], summary: 'Create employee (ADMIN, HR)', security: bearer,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeInput' } } } },
        responses: { 201: { description: 'Created' }, 400: { description: 'Validation failed' }, 403: { description: 'Forbidden' }, 409: { description: 'Duplicate' } },
      },
    },
    '/api/employees/{id}': {
      get: { tags: ['Employees'], summary: 'Get employee', security: bearer, parameters: [idParam], responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } } },
      patch: {
        tags: ['Employees'], summary: 'Update employee (ADMIN, HR)', security: bearer, parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeInput' } } } },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: { tags: ['Employees'], summary: 'Soft delete (ADMIN, HR)', security: bearer, parameters: [idParam], responses: { 204: { description: 'Deleted' }, 404: { description: 'Not found' } } },
    },
  },
};