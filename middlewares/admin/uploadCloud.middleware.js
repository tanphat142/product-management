const streamUploadHelper = require("../../helpers/streamUpload.helper");

module.exports.uploadSingle = async (req, res, next) => {
  if (req.file) {
    const link = await streamUploadHelper.upload(req.file.buffer);
    req.body[req.file.fieldname] = link;
  }

  next();
};
