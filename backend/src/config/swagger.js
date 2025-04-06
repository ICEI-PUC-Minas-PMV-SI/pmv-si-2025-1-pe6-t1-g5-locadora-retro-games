import swaggerAutogen from 'swagger-autogen' 

const swaggerAutogenOpenAi = swaggerAutogen({ openapi: '3.0.0' });

const doc = {
    info: {
        version: "1.0.0",
        title: "Nintendin Backend",
        description: "Backend da aplicação"
    },
    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],
    components: {
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};

const outputFile = './swagger-output.json';
const routes = ['../index.js'];

swaggerAutogenOpenAi(outputFile, routes, doc).then(() => {
    require('../index.js');
});