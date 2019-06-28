import jwt from 'express-jwt';

// eslint-disable-next-line consistent-return
function getTokenFromHeader (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
}

export default jwt({
  secret: process.env.JWT_SECRET || 'UnS3CuR3_S1Gn@tUr3',
  userProperty: 'token', // access by req.token
  getToken: getTokenFromHeader,
});
