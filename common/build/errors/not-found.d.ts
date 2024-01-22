import CustomAPIError from './custom-api';
declare class NotFoundError extends CustomAPIError {
    statusCode: any;
    constructor(message: string);
}
export default NotFoundError;
