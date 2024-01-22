import CustomAPIError from './custom-api';
declare class BadRequestError extends CustomAPIError {
    statusCode: any;
    constructor(message: string);
}
export default BadRequestError;
