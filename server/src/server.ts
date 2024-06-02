import fastify from 'fastify'
import cors from "@fastify/cors";
import multipart from '@fastify/multipart'
import { userRoutes } from './routers/user';
import { midiasRoutes } from './routers/midia';
import { uploadRoutes } from './routers/upload';
import { resolve } from 'node:path';
import { commentsRoutes } from './routers/coment';
import { playlistsRoutes } from './routers/playlist';

const app = fastify()

app.register(multipart)

app.register(require('@fastify/static'),{
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads'
})

app.register(cors, {
  origin: true,
});

app.register(userRoutes)
app.register(midiasRoutes)
app.register(uploadRoutes)
app.register(commentsRoutes);
app.register(playlistsRoutes)

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Correndo na porta 3333");
  })
  .catch((error) => {
    console.log(error);
  });

