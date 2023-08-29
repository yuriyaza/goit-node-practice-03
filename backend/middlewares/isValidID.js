const { isValidObjectId} = require('mongoose')

module.exports = (req, res, next) => {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    next();
  } else { 
    res.status(400);
    throw new Error ('Invalid ID')
  }
}
