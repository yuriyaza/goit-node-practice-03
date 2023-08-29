const express = require('express');
const path = require('path');
const configPath = path.join(__dirname, '..', 'config', '.env');
require('dotenv').config({ path: configPath });
const connectDb = require('../config/connectDb');
require('colors');
const app = express();
const errorHandler = require('./middlewares/errorHandler');
const asyncHandler = require('express-async-handler');
const UsersModel = require('./models/usersModel');
const RolesModel = require('./models/rolesModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middlewares/authMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// console.log(process.env.PORT);
// console.log(process.env.DB_HOST);
// console.log(process.env.USER);

// Реєстрація - додавання нового користувача до БД
// Аутентифікація - перевірка даних, які надав користувач, і порівняння з даними в БД
// Авторизація - перевірка прав користувача
// Logout - вихід із системи

app.post( '/register',
  asyncHandler(async (req, res) => {
    // 1. Отримуємо та валідуємо дані від користувача
    // 2. Шукаємо користувача в БД
    //    знайшли - повідомляємо, що користувач вже існує
    //    не знайшли - користувач новий, хешуємо пароль
    // 3. Зберігаємо користувача із захешованим паролем

    const { email, password, name } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Provide all required fields');
    }
    const candidate = await UsersModel.findOne({ email });
    if (candidate) {
      res.status(400);
      throw new Error('User already exist');
    }
    const hashPassword = bcrypt.hashSync(password, 5);
    const roles = await RolesModel.findOne({title: 'USER'})
    const user = await UsersModel.create({
      ...req.body,
      password: hashPassword,
      roles: [roles.title]
    });
    res.status(201).json({ code: 201, data: { email: user.email } });
  })
);

app.post( '/login',
  asyncHandler(async (req, res) => {
    // 1. Отримуємо та валідуємо дані від користувача
    // 2. Шукаємо користувача в БД та розшифровуємо пароль
    //    не знайшли або не розшифрували пароль - повертаємо помилку
    //    знайшли та розшифрували - генеруємо токен
    // 3. Зберігаємо користувача із токеном в БД

    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Provide all required fields');
    }
    const user = await UsersModel.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error('Invalid login or password');
    }
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      res.status(400);
      throw new Error('Invalid login or password');
    }
    const token = generateToken({
      friends: ['yura', 'oleksiy', 'luda'],
      id: user._id,
      roles: user.roles,
    });
    user.token = token;
    await user.save();
    res.status(200).json({ code: 200, data: { email: user.email, token: user.token } });
  })
);

app.get( '/logout',
  authMiddleware,
  asyncHandler(async (req, res) => {
    console.log(req.user.id);
    const user = await UsersModel.findById(req.user.id);
    user.token = null;
    await user.save();
    res.status(200).json({ code: 200, message: 'Logout successful' });
  })
);

function generateToken(data) {
  const payload = { ...data };
  return jwt.sign(payload, 'cat', { expiresIn: '8h' });
}

app.use('/api/v1', require('./routes/carsRoutes'));
app.use(errorHandler);

connectDb();
app.listen(process.env.PORT, () => {
  console.log(`Server is runing on port ${process.env.PORT}`.green.italic.bold);
});
