import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
//import { compre } from "./compre";

export async function midiasRoutes(app: FastifyInstance) {
  app.get("/midias", async (request, reply) => {
    const midias = await prisma.midia.findMany({
      orderBy: {
        titulo: "asc",
      },
    });
    reply.send(midias);
  });

  //Caminho para reproduzir um vídeo
  app.get("/videos/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);

    const midia = await prisma.midia.findUniqueOrThrow({
      where: {
        id,
      },
    });

    // Obtém o caminho do vídeo
    const titulo = midia.titulo;
    const autor = midia.autor;
    const path = midia.path;
    const capa = midia.capa;
    const userId = midia.userId;
    const compositor = midia.compositor;
    const historia = midia.historia;
    const editora = midia.editora;
    const grupo = midia.grupo;

    const midias = {
      path,
      capa,
      autor,
      titulo,
      userId,
      compositor,
      historia,
      editora,
      grupo,
    };
    reply.send(midias);
  });

  app.get("/midias/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);

    const midia = await prisma.midia.findUniqueOrThrow({
      where: {
        id,
      },
    });

    reply.send(midia);
  });

  app.get("/midia/:userId", async (request, reply) => {
    const { userId } = request.params;
    const { admin } = request.query;
  
    let where = {};
  
    if (admin === "true") {
      // Exibir todas as mídias para usuários com admin=true
      // Não aplicar nenhum filtro
    } else {
      // Exibir apenas as mídias correspondentes ao userId para usuários com admin=false
      where = {
        userId,
      };
    }
  
    const midias = await prisma.midia.findMany({
      where,
      orderBy: {
        titulo: "asc",
      },
    });

    console.log(midias)
  
    reply.send(midias);
  });

  app.post("/gravar/midias", async (request, reply) => {
    const bodySchema = z.object({
      titulo: z.string(),
      autor: z.string(),
      compositor: z.string(),
      editora: z.string(),
      grupo: z.string(),
      historia: z.string(),
      capa: z.string(),
      tipo: z.string(),
      path: z.string(),
      userId: z.string(),
    });
    const {
      titulo,
      path,
      tipo,
      autor,
      compositor,
      editora,
      grupo,
      historia,
      capa,
      userId,
    } = bodySchema.parse(request.body);

    const midia = await prisma.midia.create({
      data: {
        titulo,
        tipo,
        autor,
        compositor,
        path,
        editora,
        grupo,
        historia,
        capa,
        userId,
      },
    });

    reply.send(midia);
  });

  app.get("/midias/search/:titulo", async (request, reply) => {
    const paramsSchema = z.object({
      titulo: z.string(),
    });

    const { titulo } = paramsSchema.parse(request.params);

    const midia = await prisma.midia.findMany({
      where: {
        titulo,
      },
    });

    return midia;
  });

  app.get("/midias/search/autor/:autor", async (request, reply) => {
    const paramsSchema = z.object({
      autor: z.string(),
    });

    const { autor } = paramsSchema.parse(request.params);

    const midia = await prisma.midia.findMany({
      where: {
        autor,
      },
    });

    reply.send(midia);
  });

  app.post("/midias", async (request, reply) => {
    try {
      const bodySchema = z.object({
        titulo: z.string(),
        autor: z.string(),
        compositor: z.string(),
        editora: z.string(),
        grupo: z.string(),
        historia: z.string(),
        capa: z.string(),
        tipo: z.string(),
        path: z.string(),
        userId: z.string(),
      });

      const {
        titulo,
        path,
        tipo,
        autor,
        compositor,
        editora,
        grupo,
        historia,
        capa,
        userId,
      } = bodySchema.parse(request.body);

      console.log("Parsed request body:", { titulo, path, tipo, autor, compositor, editora, grupo, historia, capa, userId });

      const midia = await prisma.midia.create({
        data: {
          titulo,
          tipo,
          autor,
          compositor,
          path,
          editora,
          grupo,
          historia,
          capa,
          userId,
        },
      });

      console.log("Midia created:", midia);
      reply.send(midia);
    } catch (error) {
      console.error("Error handling /midias request:", error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.put("/midias/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      titulo: z.string(),
      autor: z.string(),
      compositor: z.string(),
      editora: z.string(),
      grupo: z.string(),
      historia: z.string(),
    });

    const {
      titulo,
      autor,
      compositor,
      editora,
      grupo,
      historia,
    } = bodySchema.parse(request.body);

    let midia = await prisma.midia.findUniqueOrThrow({
      where: {
        id,
      },
    });

    midia = await prisma.midia.update({
      where: {
        id,
      },
      data: {
        titulo,
        autor,
        compositor,
        editora,
        grupo,
        historia,
      },
    });
    reply.send(midia);
  });

  app.put("/actualizar/midias/:id", async (request, reply) => {
    console.log("1");

    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);
      const bodySchema = z.object({
        titulo: z.string(),
        autor: z.string(),
        compositor: z.string(),
        editora: z.string(),
        grupo: z.string(),
        historia: z.string(),
        periodo: z.string(),
        tipo: z.string(),
        path: z.string(),
        capa: z.string(),
      });
      const {
        titulo,
        tipo,
        path,
        autor,
        compositor,
        editora,
        grupo,
        historia,
        periodo,
        capa,
      } = bodySchema.parse(request.body);

      let midia = await prisma.midia.findUniqueOrThrow({
        where: {
          id,
        },
      });
      midia = await prisma.midia.update({
        where: {
          id,
        },
        data: {
          titulo,
          tipo,
          path,
          autor,
          compositor,
          editora,
          grupo,
          historia,
          periodo,
          capa,
        },
      });

      reply.send(midia);
    } catch (error) {
      console.error("Erro ao atualizar a mídia:", error);
      reply.status(500).send("Erro ao atualizar a mídia");
    }
  });

  app.delete("/midias/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    });

    try {
      const { id } = paramsSchema.parse(request.params);

      const midia = await prisma.midia.findUniqueOrThrow({
        where: {
          id,
        },
      });
      await prisma.midia.delete({ where: { id } });
      return { message: "Midia excluída com sucesso" };
    } catch (error) {
      reply.status(404).send({ error: "Midia não encontrada" });
    }
  });
}
