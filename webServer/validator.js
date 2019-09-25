module.exports = function (parameterName, validation) {
    return (req, res, next) => {
        if (validation === Number) {
            if (typeof req.body[parameterName] !== 'number') {
                return res.status(400).send(`${parameterName} is not a number!`);
            }
        } else if (validation === String) {
            if (typeof req.body[parameterName] !== 'string') {
                return res.status(400).send(`${parameterName} is not a string!`);
            }
        } else if (validation === Date) {
            /**
             * See REAMDE comments
             */
            return next();
        }

        return next();
    }
};