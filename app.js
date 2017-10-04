var Hapi = require('hapi');
var jwt = require('jsonwebtoken');
const Blipp = require('blipp');
const Inert = require('inert');
const Vision = require('vision');

const HapiSwagger = require('hapi-swagger');

const Joi = require('joi');

const { SwaggerUIBundle, SwaggerUIStandalonePreset } = require('swagger-ui-dist');


let swaggerOptions = {
    info: {
        title: 'Test API Documentation',
        description: 'This is a sample example of API documentation.'
    },
    jsonEditor: true,
    securityDefinitions: {
        jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    security: [{ jwt: [] }],

};

var people = {
    56732: {
        id: 56732,
        name: 'Jen Jones',
        scope: ['a', 'b']
    }
};

var privateKey = 'hapi hapi joi joi';
var token = jwt.sign({ id: 56732 }, privateKey, { algorithm: 'HS256' });

// bring your own validation function
var validate = function(decoded, request, callback) {
    // do your checks to see if the person is valid
    if (!people[decoded.id]) {
        return callback(null, false);
    }
    return callback(null, true, people[decoded.id]);
};

var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3000
}, {
    cors: true
}
);

server.register(
    [
        require('hapi-auth-jwt2'),
        Inert,
        Vision,
        Blipp,
        {
            register: HapiSwagger,
            options: swaggerOptions
        }
    ],
    function(err) {
        if (err) {
            console.log(err);
        }

        server.auth.strategy('jwt', 'jwt', {
            key: privateKey,
            validateFunc: validate,
            verifyOptions: { algorithms: ['HS256'] }
        });

        server.auth.default('jwt');


        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: './dist',
        });


        server.route([
            {
                method: 'GET',
                path: '/',
                config: {
                    auth: false,
                    handler: function(request, reply) {
                        reply({ text: 'Token not required' });
                    }
                }
            },
            {
                method: 'GET',
                path: '/restricted',
                config: {
                    tags: ['api'],
                    handler: function(request, reply) {
                        reply({
                            text:
                            'You used a Token! ' +
                            request.auth.credentials.name
                        }).header(
                            'Authorization',
                            request.headers.authorization
                        );
                    },
                }
            },
            {
                method: 'GET',
                path: '/token',
                config: {
                    auth: false,
                    tags: ['api'],
                    handler: function(request, reply) {
                        reply({ token: token });
                    }
                }
            },
            {
                method: 'GET',
                path: '/{param*}',
                config: {
                    auth: false,
                    handler: {
                        directory: {
                            path: 'dist',
                            listing: true
                        }
                    }
                },
            },
            {
                method: 'GET',
                path: '/docs',
                config: {
                    auth: false,
                    handler: (request, reply) => {
                        reply.view('index');
                    }
                },
            }

        ]);
    }
);

server.start(function() {
    console.log('Server running at:', server.info.uri);
});