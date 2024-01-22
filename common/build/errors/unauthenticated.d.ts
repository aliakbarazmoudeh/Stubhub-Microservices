import CustomAPIError from './custom-api';
declare class UnauthenticatedError extends CustomAPIError {
    statusCode: any;
    constructor(message: string);
}
export default UnauthenticatedError;
