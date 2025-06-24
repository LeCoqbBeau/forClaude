import Fastify from 'fastify';

const fastify = Fastify({
    logger: true
});

fastify.get('/api/test', function(request, reply) {
    reply.send({hello: "world"});
})

async function main() {
    try {
        await fastify.listen({ port: 3000, host: '127.0.0.1'});
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
    return ;
}

await main();