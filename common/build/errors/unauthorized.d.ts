import CustomAPIError from './custom-api';
declare class UnauthorizedError extends CustomAPIError {
    statusCode: number;
    constructor(message: string);
}
export default UnauthorizedError;
