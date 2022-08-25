const User = require('./../Models/userModel');
const appError = require('./../utilities/appError');
const FeaturesAPI = require('./../utilities/features');
const catchAsync = require('../utilities/catchAsync');

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) next(new appError('unable to find user with this ID', 404));

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) next(new appError('unable to find user with this ID', 404));

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false });

  if (!user) next(new appError('unable to find user with this ID', 404));

  res.status(201).json({
    status: 'success',
    massage: 'User is Deleted',
  });
});
