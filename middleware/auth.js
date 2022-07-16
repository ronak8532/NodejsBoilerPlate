const jwt = require("jsonwebtoken");
const config = require("../config/var");
const {
    app: { jwt_key }
} = config;

module.exports = (...allowed) => {
    const isAllowed = role => {
        return allowed.indexOf(role) > -1;
    };
    return function(req, res, next) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, 'invoice-management');
            req.userData = {
                username: decodedToken.username,
                userId: decodedToken.user_id,
                role: decodedToken.role
            };
            if (isAllowed(decodedToken.role)) {
                next()
            } else {
                return res.status(401).json({
                    success: false,
                    error_message: 'Unauthorized - This user does not have privilege to access this method',
                })
            }
        } catch (error) {
            res.status(401).json({ success: false, error_message: "You are not authenticated!" });
        }
    }
};