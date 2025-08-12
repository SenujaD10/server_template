interface IError {
  statusCode: number;
}

export class GeneralError extends Error implements IError {
  statusCode: number;

  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ClientError extends GeneralError {
  constructor(message?: string, statusCode?: number) {
    super("ClientError", message || "Client Error.", statusCode || 400);
  }
}

export class FieldRequiredError extends ClientError {
  constructor() {
    super("Required fields are missing.", 400);
  }
}
