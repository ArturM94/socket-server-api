import jwt from 'express-jwt';
import config from '../config';

// eslint-disable-next-line consistent-return
function getTokenFromHeader (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
}

export default jwt({
  secret: config.auth.JWT_SECRET,
  userProperty: 'token', // access by req.token
  getToken: getTokenFromHeader,
});
