import { fastify } from 'fastify'
// import { DatabaseMemory } from './database-memory.js'
import { DatabasePostgres } from './database-postgres.js'

const server = fastify()

// const database = new DatabaseMemory()
const database = new DatabasePostgres()

server.post('/videos', async (request, reply) => {
    const { title, description, duration } = request.body

    await database.create({
        title,
        description,
        duration,
    })

    return reply.status(201).send()
})

server.get('/videos', async (request) => {
    const search = request.query.search

    const videos = await database.list(search)

    return videos
})

server.put('/videos/:id', async (request, reply) => {
    const videoId = request.params.id
    const { title, description, duration } = request.body

    await database.update(videoId, {
        title, 
        description,
        duration,
    })

    return reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => {
    const videoId = request.params.id

    await database.delete(videoId)

    return reply.status(204).send()
})

// NA MINHA MÁQUINA
// server.listen({
//     port: 3333,
// })

// DEPLOY
// server.listen({
//     port: process.env.PORT ?? 3333, 
// })

// Inicialização do servidor
const startServer = async () => {
    try {
        await server.listen({
            port: process.env.PORT ?? 3333,
            host: '0.0.0.0',
        });
        console.log(`Servidor rodando em http://0.0.0.0:${process.env.PORT ?? 3333}`);
    } catch (err) {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1);
    }
};

startServer();