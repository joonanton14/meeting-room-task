export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new ApiError(400, "bad_request", message, details);

export const notFound = (message: string, details?: unknown) =>
  new ApiError(404, "not_found", message, details);

export const conflict = (message: string, details?: unknown) =>
  new ApiError(409, "conflict", message, details);
