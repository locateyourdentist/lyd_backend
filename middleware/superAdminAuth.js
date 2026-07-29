module.exports = (req, res, next) => {
    if (!req.user || req.user.userType !== 'superAdmin') {
        return res.send({ status: 'error', message: 'Access denied: Super Admin only' });
    }
    next();
};
