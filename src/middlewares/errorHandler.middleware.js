import { statusError } from "../utils/StatusError.js";

export const errorHandlerMiddleware = (error, req, res, next) => {
  switch (error.status) {
    case statusError.NOT_FOUND:
      res.status(404).send({
        message: error.message || "Not Found",
        status: statusError.NOT_FOUND,
      });
      break;
    case statusError.BAD_REQUEST:
      res.status(400).json({
        message: error.message || "Bad Request",
        status: statusError.BAD_REQUEST,
      });
      break;
    default:
      res.status(500).json({
        message: "Internal Server Error",
        status: statusError.GENERIC_ERROR,
      });
  }
};
