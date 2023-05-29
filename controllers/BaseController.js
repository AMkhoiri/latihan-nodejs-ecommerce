import fs from 'fs/promises';
import { format } from 'date-fns';

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

  async handleServerError(req, res, error) {

    const logFolderPath = `logs/errors`;
    const logFileName = `error(${format(new Date(), 'yyyy-MM')}).json`;

    const fileExists = await BaseController.checkFileExists(logFolderPath, logFileName);

    if (fileExists !== null) {
      try {
        const errorData = {
          time: format(new Date(), 'yyyy-MM-dd HH:mm'),
          errorType: error.name,
          errorMessage: error.message,
          request: {
            route: req.originalUrl,
            method: req.method,
            contentType: req.header('content-type'),
            body: JSON.stringify(req.body),
          },
          user: {
            id: req.userData.id,
            username: req.userData.username
          }
        };

        const logData = JSON.stringify(errorData, null, 2) + '\n\n';

        if (fileExists) {
          const existingLogs = await fs.readFile(`${logFolderPath}/${logFileName}`, 'utf8');
          const updatedLogs = logData + existingLogs;
          await fs.writeFile(`${logFolderPath}/${logFileName}`, updatedLogs, 'utf8');
        }
        else {
          await fs.writeFile(`${logFolderPath}/${logFileName}`, logData);
        }
      } catch (err) {
        console.error('Gagal menyimpan log kesalahan:', err);
      }
    }

    res.status(500).json({
      code: 500,
      success: false,
      message: "Terjadi kesalahan koneksi",
    });
  }

  /* untuk handle validasi model & validasi "espress-validator" */
  handleValidationError(res, errors) {
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


  static async checkFileExists(folderPath, fileName) {
    try {
      const files = await fs.readdir(folderPath);

      return files.includes(fileName);
    }
    catch (error) {
      return null;
    }
  }

}

export default BaseController;
