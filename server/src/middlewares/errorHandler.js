class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    if(process.env.NODE_ENV !== 'production') {
        console.error(err);
    }

    // Mongoose bad ObjectId / MySQL similar type errors
    // if (err.name === 'CastError') {
    //     const message = `Resource not found`;
    //     error = new ErrorResponse(message, 404);
    // }

    // Duplicate key error
    if (err.code === 11000 || err.code === 'ER_DUP_ENTRY') {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = {
    errorHandler,
    ErrorResponse
};
