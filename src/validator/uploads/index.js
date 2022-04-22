const InvariantError = require('../../exceptions/InvariantError');
const ImageHeadersSchema = require('./schema');

const UploadValidator = {
    validateImageHeaders: (payload) => {
        const result = ImageHeadersSchema.validate(payload);

        if (result.error) {
            throw new InvariantError(result.error.message);
        }
    }
}

module.exports = UploadValidator;