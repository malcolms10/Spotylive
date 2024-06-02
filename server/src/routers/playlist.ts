import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { adicionarMidiaNaPlaylist } from "./addPlaylist";

export async function playlistsRoutes(app:FastifyInstance) {
    
    app.get('/playlist', async (request) => {
        const playlists = await prisma.playlist.findMany({
          orderBy: {
            nome: 'asc',
          },
        })
        return playlists.map((playlist) => {
          return {
            id: playlist.id,
            nome:playlist.nome,
            userId:playlist.userId   
          }
        })
    })

    app.get('/playlists/pub', async (request, response) => {
      const { visibility } = request.query;
    
      let where = {};
    
      if (visibility === 'true') {
        // Exibir apenas playlists com visibilidade true
        where = { visibility: 'true' };
      }
    
      try {
        const playlists = await prisma.playlist.findMany({
          where : { visibility: 'true' }
        });
    
        response.send(playlists);
      } catch (error) {
        console.error('Erro ao obter playlists:', error);
      }
    });

    app.get('/playlist/:userId', async (request,reply) => {
        const paramsSchema = z.object({
            userId: z.string(),
        }) 

        const { userId } = paramsSchema.parse(request.params)

        const playlists = await prisma.playlist.findMany({
            where: {
              userId,
            },
        })

        reply.send(playlists);
    })

    app.post('/playlist', async (request) => {
      const bodySchema = z.object({
        nome: z.string(),
        userId: z.string(),
        visibility: z.string(),
      })
  
      const { nome, userId,visibility } = bodySchema.parse(request.body)
  
      const playlist = await prisma.playlist.create({
        data: {
          nome,userId,visibility
        },
      })
      return playlist
    })

    app.post('/adicionar-midia-na-playlist', async (req, res) => {
      const { playlistId, midiaId } = req.body;
    
      try {
        // Aqui você pode chamar a função adicionarMidiaNaPlaylist
        // passando os parâmetros playlistId e midiaId
        await adicionarMidiaNaPlaylist(playlistId, midiaId);
    
        res.status(200).json({ message: 'Mídia adicionada à playlist com sucesso.' });
      } catch (error) {
        console.error('Erro ao adicionar mídia na playlist:', error);
        res.status(500).json({ error: 'Erro ao adicionar mídia na playlist.' });
      }
    });

}