const User = require('./../Models/userModel');
const appError = require('./../utilities/appError');
const FeaturesAPI = require('./../utilities/features');
const catchAsync = require('../utilities/catchAsync');
const promisfy = require('promisfy');
const { exists } = require('./../Models/userModel');

const createSendToken = (user, statusCode, res) => {
  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  //Gettingtokeen and chec of its there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new appError('User is not Logged in Please Log in!!!'));
  }
  // Verfiyingg tokeenn
  const decode = await promisfy(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user stikk exists
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(new appError('user belong to this token doesnot exit', 401));
  }

  // check if user change password after logged in
  if (currentUser.changePasswordAfter(decode.iat)) {
    return next(new appError('Please Logged in again', 401));
  }

  //GRAND ACCESS TO PROTECTED ROUTES
  req.user = currentUser;
});

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  createSendToken(user, 201, res);
});

exports.logInUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new appError('Please Provide Email and Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new appError('Input Email or Password in inCorrect', 401));
  }

  createSendToken(user, 201, res);
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You Dont Have Permission yo access this Route', 403)
      );
    }
    next();
  };
};
