const shortId = require('shortid');

const shortUrlSchema = {
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
};

module.exports = { ShortUrlSchema: shortUrlSchema };
