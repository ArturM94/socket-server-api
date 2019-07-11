import { body, param } from 'express-validator';

const EmailValidator = () => [
  body('email', 'Should be an email')
    .isEmail(),
];

const PasswordValidator = () => [
  body('password', 'Length should be not less 5 symbols')
    .trim()
    .isLength({ min: 5 }),
];

const MongoIdValidator = (field) => [
  param(field, 'Invalid ID type')
    .isMongoId(),
];

const MessageBodyValidator = () => [
  body('messageBody', 'Message should not be empty')
    .not()
    .isEmpty()
    .trim(),
];

export {
  EmailValidator,
  PasswordValidator,
  MongoIdValidator,
  MessageBodyValidator,
};
