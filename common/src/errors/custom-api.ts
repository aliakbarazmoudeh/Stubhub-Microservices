class CustomAPIError extends Error {
  constructor(message: any) {
    super(message);
  }
}

export default CustomAPIError;
