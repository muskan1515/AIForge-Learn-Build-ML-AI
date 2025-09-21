module.exports = (err, req, res, next) => {
  console.error(err);
  
  res.status(err.status || 500).send({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
