export class AppError extends Error {
  constructor(public statusCode: number, message: string, public details?: unknown) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}