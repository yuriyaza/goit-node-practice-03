const { model, Schema } = require('mongoose');

const rolesSchema = new Schema({
  title: {
    type: String,
    default: 'USER',
  },
});

module.exports = model('roles', rolesSchema);
