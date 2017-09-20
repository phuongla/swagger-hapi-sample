/**
 * Created by phuongla on 9/20/2017.
 */
const Joi = require('joi');

const Routes = [
    {
        method: 'GET',
        path: '/hello/{name}',
        config: {
            handler: (request, reply) => {
                reply({
                    code: 1,
                    msg: `hello ${request.params.name}`
                });
            },
            description: 'hello name',
            notes: 'Returns a greeting with name',
            tags: ['api', 'api1'],
            validate: {
                params: {
                    name: Joi.string().required().description('your name')
                }
            },
        },
    },
    {
        method: 'POST',
        path: '/hello',
        config: {
            handler: (request, reply) => {
                reply({
                    code: 1,
                    msg: `hello ${request.payload.name}`
                });
            },
            description: 'hello with post',
            notes: 'Returns a greeting with name',
            tags: ['api'],
            validate: {
                payload: {
                    name: Joi.string().required().description('your name')
                }
            },
        },
    }
]

module.exports  = Routes;