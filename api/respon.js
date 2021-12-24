module.exports = {
    SUCCESS: (res, status, data) => {
        res.status(status).json({
            success: true,
            data: data
        });
    },
    ERROR: (res, status, message) => {
        res.status(status).json({
            success: false,
            data: null,
            message: message
        });
    }
}