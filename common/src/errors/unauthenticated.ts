import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api';

class UnauthenticatedError extends CustomAPIError {
  statusCode: any;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
