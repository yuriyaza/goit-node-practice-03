const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Отримуємо токен із заголовка
    // 2. Розшифровуємо токен
    // 3. Передаємо інформацію з токена далі
    const [type, token] = req.headers.authorization.split(' ');
    if (type !== 'Bearer' || !token) {
      res.status(401);
      throw new Error('Unauthorized');
      }
      const decoded = jwt.verify(token, 'cat');
      req.user = decoded;
      next();
  } catch (error) {
    res.status(401).json({ code: 401, message: error.message });
  }
};

// {
//   friends: [ 'yura', 'oleksiy', 'luda' ],
//   id: '64ee1e0aeddaff21b78f7e50',
//   iat: 1693329304,
//   exp: 1693358104
// }
