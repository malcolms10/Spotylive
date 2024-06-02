import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";


export async function userRoutes(app: FastifyInstance) {
  app.get('/actualizar/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    });
  
    const { id } = paramsSchema.parse(request.params);
  
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
  
    if (!user) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }
  
    return user;
  });
  
    app.get('/user', async (request) => {
      const users = await prisma.user.findMany({
        orderBy: {
          email: 'asc',
        },
      })
      return users.map((user) => {
        return {
          id: user.id,
          email: user.email,
          password: user.password,  
          admin: user.admin,       
        }
      })
    })
  
    app.get('/user/:email', async (request, reply) => {
        const paramsSchema = z.object({
            email: z.string(),
        })
      
        const { email } = paramsSchema.parse(request.params)
      
        const user = await prisma.user.findUniqueOrThrow({
            where: {
              email,
            },
        })
        return user
    })
  
  app.get('/userId/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    });
  
    const { id } = paramsSchema.parse(request.params);
  
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
    return user;
  });

    app.post('/user', async (request) => {
            const bodySchema = z.object({
                email: z.string(),
                password: z.string(),  
                admin: z.string(), 
                about: z.string(),
                
            })
        
            const { email, password , admin, about} = bodySchema.parse(request.body)
            const followers = 0
            const following = 0

        
            const user = await prisma.user.create({
              data: {
                email,password, admin , about, followers, following},
            })
            return user
    })
  
    app.put('/user/:id/admin', async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string(),
      });
  
      const { id } = paramsSchema.parse(request.params);
  
      let user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
  
      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }
  
      user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          admin: 'true',
        },
      });
  
      return user;
    });  
  
    app.delete('/user/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
          })
      
          const { id } = paramsSchema.parse(request.params)
      
          const user = await prisma.user.findUniqueOrThrow({
            where: {
              id,
            },
          })
      
          await prisma.user.findUniqueOrThrow({
            where: {
              id,
            },
          })
    })
}