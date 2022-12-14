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


module.exports = function (requiredrole = "user") {
    return function (req, res, next) {
        const token = req.cookies.token;
        verifyJWT(token,res)
            .then(decoded => {
                if (requiredrole === "user" && (decoded.role === "admin" || decoded.role === "user")) {
                    next()
                    return
                }
                if (requiredrole === "admin" && decoded.role === "admin" ) {
                    next()
                    return
                }
                return Promise.reject(new Error('Role Error'));
                
            })
            .catch(next);
    };
}