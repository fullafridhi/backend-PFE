//AppError allows to create standardized error responses in the application and  can differentiate between different types of errors (e.g., client errors vs. server errors) easily.


class AppError extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode =statusCode;
        this.statu=`${statusCode}`.startsWith('4') ?'fail':'error'
        Error.captureStackTrace(this,this.constructor)
        

    }
}
module.exports = AppError