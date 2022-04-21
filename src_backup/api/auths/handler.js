const ClientError = require('../../exceptions/ClientError');

class AuthHandler {
    constructor(authsService, usersService, tokenManager, validator) {
        this._authsService = authsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthHandler = this.postAuthHandler.bind(this);
        this.putAuthHandler = this.putAuthHandler.bind(this);
        this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
    }

    async postAuthHandler(request, h) {
        try {
            this._validator.validatePostAuthPayload(request.payload);

            const { username, password } = request.payload;
            const id = await this._usersService.verifyUserCredential(username, password);
            
            const accessToken = this._tokenManager.generateAccessToken({ id });
            const refreshToken = this._tokenManager.generateRefreshToken({ id });

            await this._authsService.addRefreshToken(refreshToken);

            const respone = h.response({
                status: 'success',
                message: 'Authentication berhasil ditambahkan',
                data: {
                    accessToken,
                    refreshToken,
                }
            });
            respone.code(201);
            return respone;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                status: 'fail',
                message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
        
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;            
        }
    }

    async putAuthHandler(request, h) {
        try {
            this._validator.validatePutAuthPayload(request.payload);

            const { refreshToken } = request.payload;
            await this._authsService.verifyRefreshToken(refreshToken);
            const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

            const accessToken = this._tokenManager.generateAccessToken({ id });
            return {
                status: 'success',
                message: 'Access Token berhasil diperbarui',
                data: {
                    accessToken,
                }
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                status: 'fail',
                message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
        
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response; 
        }
    }

    async deleteAuthHandler(request, h) {
        try {
            this._validator.validateDeleteAuthPayload(request.payload);

            const { refreshToken } = request.payload;
            await this._authsService.verifyRefreshToken(refreshToken);            
            await this._authsService.deleteRefreshToken(refreshToken);            

            return {
                status: 'success',
                message: 'Refresh token berhasil dihapus',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                status: 'fail',
                message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
        
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response; 
        }
    }
}

module.exports = AuthHandler;