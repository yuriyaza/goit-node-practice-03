const carsController = require('../controllers/Cars');
const isValidID = require('../middlewares/isValidID');
const rolesMiddleware = require('../middlewares/rolesMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Cannot GET /api/v1/cars

const carsRoutes = require('express').Router();

// Додати машину
carsRoutes.post('/cars', authMiddleware, carsController.add);

// Отримати всі
// Ролі: ['ADMIN', 'MODERATOR', 'USER', 'CTO']
carsRoutes.get(
  '/cars',
  authMiddleware,
  rolesMiddleware(['ADMIN', 'MODERATOR']),
  carsController.getAll
);

// Отримати одну машину
carsRoutes.get('/cars/:id', isValidID, carsController.getOne);

// Обновити машину
carsRoutes.patch('/cars/:id', carsController.update);

// Видалити машину
carsRoutes.delete('/cars/:id', carsController.remove);

module.exports = carsRoutes;
