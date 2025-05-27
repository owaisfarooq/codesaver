export enum ErrorCode {
    'INVALID_INPUT' = 4,
    'INCOMPLETE_INPUT' = 9,
    'NOT_FOUND' = 5,
    'UNAUTHORIZED' = 6,
    'FORBIDDEN' = 7,
    'SERVER_ERROR' = 8,
}
export class AppError {
    constructor(
        public message: string,
        public code: ErrorCode,
        public details?: any
    ) {
        this.message = message;
        this.code = code;
        this.details = details;
    }

    toString() {
        return `Error ${this.code}: ${this.message}`;
    }
}