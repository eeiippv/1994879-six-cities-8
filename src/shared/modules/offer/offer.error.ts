import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';
import { Component } from '../../types/index.js';

export class NotFoundOfferError extends HttpError {
  constructor() {
    super(StatusCodes.NOT_FOUND, 'Предложение не найдено', Component.UserController.description);
  }
}
