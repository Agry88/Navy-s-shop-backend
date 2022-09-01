const jwt = require('jsonwebtoken');

async function verifyJWT(token,res) {
    if (!token) {
        res
        .status(400)
        .json({ message: "Missing Token" });
        return Promise.reject(new Error('No Token'));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
}


module.exports = function (options = {}) {
    return function (req, res, next) {
        const token = req.cookies.token;
        verifyJWT(token,res)
            .then(decoded => {
                if (decoded.role === "admin") {
                    next()
                    return
                } else{
                    return Promise.reject(new Error('Role Error'));
                }
                
            })
            .catch(next);
    };
}