const { body, validationResult } = require('express-validator');

const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    // Custom validation for phone (accept both 'phone' and 'phoneNumber')
    body().custom((value, { req }) => {
        const phoneNum = req.body.phoneNumber || req.body.phone;
        if (!phoneNum) {
            throw new Error('Phone number is required');
        }
        if (!/^[0-9]{10}$/.test(phoneNum)) {
            throw new Error('Valid 10-digit phone number is required');
        }
        return true;
    }),
    // Custom validation for role (accept both 'role' and 'userRole')
    body().custom((value, { req }) => {
        const userRole = req.body.userRole || req.body.role || 'tenant';
        const validRoles = ['master_admin', 'owner', 'canteen_provider', 'tenant'];
        if (!validRoles.includes(userRole)) {
            throw new Error('Invalid role');
        }
        return true;
    }),
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[VALIDATION] Validation errors:', errors.array());
        return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    handleValidationErrors,
};
