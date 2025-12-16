exports.success = (res, data, message = "Success") => {
  res.json({
    success: true,
    message,
    data,
  });
};

exports.error = (res, message, status = 400) => {
  res.status(status).json({
    success: false,
    message,
  });
};
