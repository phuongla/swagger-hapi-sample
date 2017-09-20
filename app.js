/**
 * Created by phuongla on 9/20/2017.
 */
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');

const Routes = require('./Routes')

const server = new Hapi.Server();

const Joi = require('joi');

server.connection({
    host: 'localhost',
    port: 10000
});

const options = {
    info: {
        'title': 'Test API Documentation',
        'version': '0.0.1',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    debug: true,
    documentationPath: '/docs'
};

server.register([
    Inert,
    Vision,
    {
        'register': HapiSwagger,
        'options': options
    }], (err) => {
    server.start( (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Server running at:', server.info.uri);
        }
    });
});

server.route(Routes);

