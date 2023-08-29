const jwt = require('jsonwebtoken');

module.exports = rolesArr => {
  return (req, res, next) => {
    try {
      const { roles } = req.user;
      let hasRole = false;
      roles.forEach(role => {
        if (rolesArr.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        res.status(403);
        throw new Error('Forbidden');
      }
      next();
    } catch (error) {
      res.status(403).json({ code: 403, message: error.message });
    }
  };
};

// {
//   friends: [ 'yura', 'oleksiy', 'luda' ],
//   id: '64ee34b516f9c831000b227e',
//   roles: [ 'ADMIN' ],
//   iat: 1693332803,
//   exp: 1693361603
// }
