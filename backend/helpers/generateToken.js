const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/keys');

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '3d', // يمكن تعديل مدة صلاحية الرمز حسب الحاجة - هنا 3 ايام
    });
};

module.exports = generateToken;