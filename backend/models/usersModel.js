// {
//   email: 'yura@mail.com',
//   password: 'qwe123',
//   name: 'Yura'
// }

const { model, Schema } = require('mongoose');

const usersSchema = new Schema({
  email: {
    type: String,
    required: [true, 'DB: Email is required'],
  },
  password: {
    type: String,
    required: [true, 'DB: Password is required'],
  },
  name: {
    type: String,
    default: 'John',
  },
  token: {
    type: String,
    default: null,
  },
  roles: [
    {
      type: String,
      ref: 'roles'
    },
  ],
});

module.exports = model('users', usersSchema);
