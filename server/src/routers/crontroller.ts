const { PrismaClient } = require('@prisma/client');

// Crie uma instância do PrismaClient
const prisma = new PrismaClient();

export async function adicionarMidiaNaPlaylist(playlistId, midiaId) {
  try {
    // Verifique se a playlist e a mídia existem no banco de dados
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: { midias: true }, // Inclui a lista de mídias da playlist
    });

    const midia = await prisma.midia.findUnique({ where: { id: midiaId } });

    if (!playlist || !midia) {
      throw new Error('Playlist ou mídia não encontrada.');
    }

    // Adicione o ID da mídia à lista de mídias da playlist
    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        midias: { connect: { id: midiaId } }, // Conecta a mídia existente à playlist
      },
    });

    console.log(`Mídia com ID ${midiaId} adicionada à playlist ${playlist.nome}.`);
  } catch (error) {
    console.error('Erro ao adicionar mídia na playlist:', error);
  } finally {
    await prisma.$disconnect(); // Desconecte o Prisma Client
  }
}

export async function removerMidiaDeTodasPlaylists(midiaId) {
  try {
    // Encontre todas as playlists que possuem a mídia
    const playlists = await prisma.playlist.findMany({
      where: { midias: { some: { id: midiaId } } },
    });

    // Remova a mídia de cada playlist
    await Promise.all(
      playlists.map((playlist) =>
        prisma.playlist.update({
          where: { id: playlist.id },
          data: {
            midias: { disconnect: { id: midiaId } },
          },
        })
      )
    );

    console.log(`Mídia com ID ${midiaId} removida de todas as playlists.`);
  } catch (error) {
    console.error('Erro ao remover mídia de todas as playlists:', error);
  } finally {
    await prisma.$disconnect(); // Desconecte o Prisma Client
  }
}