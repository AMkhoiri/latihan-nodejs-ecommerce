class BaseController {

  sendResponse(res, statusCode, message, data) {
    let responseFormat = {
    	code: statusCode,
      success: statusCode == 200 ? true : false,
      message,
      data
    };

    res.status(statusCode).json(responseFormat);
  }

  sendErrorResponse(res, statusCode, message, error) {
    let responseFormat = {
    	code: statusCode,
      success: false,
      message: message,
    };

    res.status(statusCode).json(responseFormat);
  }

  /* untuk handle validasi model & validasi "espress-validator" */
  sendErrorValidationResponse(res, errors) {

  	const validationErrors = errors.map(err => ({
        parameter: err.path,
        location: err.location,
        message: err.message || err.msg,
    }));

    let responseFormat = {
    	code: 400,
      success: false,
      message: "Pastikan data yang anda kirim sudah benar!",
      errorDetails: validationErrors
    };

    res.status(400).json(responseFormat);
  }
}

export default BaseController