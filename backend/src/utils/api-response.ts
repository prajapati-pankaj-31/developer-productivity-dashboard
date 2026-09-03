import { Response } from 'express';
import { ApiSuccessResponse, ApiErrorResponse } from '../types/index.js';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200
): Response<ApiSuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendCollection = <T>(
  res: Response,
  data: T[],
  count?: number,
  statusCode = 200
): Response<ApiSuccessResponse<T[]>> => {
  return res.status(statusCode).json({
    success: true,
    data,
    count: count !== undefined ? count : data.length,
  });
};

export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  details?: unknown
): Response<ApiErrorResponse> => {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
  return res.status(statusCode).json(payload);
};
