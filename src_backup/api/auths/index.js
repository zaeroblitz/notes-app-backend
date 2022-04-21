const AuthHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async (server, {
        authsService,
        usersService,
        tokenManager,
        validator
    }) => {
        const authHandler = new AuthHandler(authsService, usersService, tokenManager, validator);
        server.route(routes(authHandler));
    }
}