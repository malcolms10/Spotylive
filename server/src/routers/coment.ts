import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function commentsRoutes(app:FastifyInstance) {
    
    app.get('/comments', async (request) => {
        const comments = await prisma.comment.findMany({
          orderBy: {
            coment: 'asc',
          },
        })
        return comments.map((comment) => {
          return {
            id: comment.id,
            coment:comment.coment,
            userId:comment.userId,
            midiaId: comment.midiaId,    
          }
        })
    })

    app.get('/comments/:midiaId', async (request) => {
        const paramsSchema = z.object({
            midiaId: z.string(),
        }) 

        const { midiaId } = paramsSchema.parse(request.params)

        const comments = await prisma.comment.findMany({
            where: {
              midiaId,
            },
        })

        return comments.map((comment) => {
          return {
            id: comment.id,
            coment:comment.coment,
            userId:comment.userId,
            midiaId: comment.midiaId,    
          }
        })
    })

    app.post('/coments', async (request) => {
      const bodySchema = z.object({
        coment: z.string(),
        userId: z.string(),
        midiaId: z.string(),
      })
  
      const { coment, userId,midiaId } = bodySchema.parse(request.body)
  
      const comment = await prisma.comment.create({
        data: {
          coment,userId, midiaId
        },
      })
  
      return comment
    })

    app.delete('/comments/:midiaId', async (request, reply) => {
    const paramsSchema = z.object({
        midiaId: z.string(),
    });
    
    try {
        const { midiaId } = paramsSchema.parse(request.params);
        
        const coment = await prisma.comment.findMany({
        where: {
            midiaId,
        },
        });
        await prisma.comment.deleteMany({ where: { midiaId } })
        return { message: 'Comentário excluído com sucesso' };
    } catch (error) {
        reply.status(404).send({ error: 'Comentário não encontrado' });
    }
    });

}