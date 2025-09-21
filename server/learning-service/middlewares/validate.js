const validate = (key, schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[key], { stopEarly: false })

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                details: error.details.map(d => d.message) 
            });
        }
        req[key] = value

        next(req)
    }
}

module.exports = validate
