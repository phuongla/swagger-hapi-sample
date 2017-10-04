/**
 * Created by phuongla on 9/20/2017.
 */
const Joi = require('joi');
const Boom = require('boom');

const Routes = [
    {
        method: 'GET',
        path: '/user/{id}',
        config: {
            handler: (request, reply) => {
                reply({
                    code: 1,
                    msg: `hello ${request.params.name}`
                });
            },
            description: 'hello name',
            notes: 'Returns a greeting with name',
            tags: ['api'],
            validate: {
                params: {
                    name: Joi.string().required().description('your name')
                },
                headers: {
                    Authorization: Joi.string().required()
                }
            },
            security: [{
                api_key: [ ]
            }]
        },
    },
    {
        method: 'POST',
        path: '/user',
        config: {
            handler: (request, reply) => {
                console.log(request.payload);
                reply({
                    code: 1,
                    msg: `hello ${request.payload.username}`
                });
            },
            description: 'hello with post',
            notes: 'Returns a greeting with name',
            tags: ['api'],
            validate: {
                payload: {
                    username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
                    email: Joi.string().email().example('kami8707@gmail.com'),
                    birthday: Joi.date().iso(),
                    gender: Joi.any().valid(['male','female','other']).required().error(new Error('Gender is allow [male, female, other]')),
                    weigth: Joi.number().min(30).max(300).unit('Kg').required()
                },
                failAction: (request, reply, source, error) => {

                    error.output.payload.statusCode = 5;
                    error.output.payload.error = "Input invalid";
                    error.output.payload.message = 'custom error message here';

                    return reply(error);
                }

            },
        },
    }
]

module.exports  = Routes;