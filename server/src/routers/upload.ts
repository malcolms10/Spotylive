import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { extname, resolve } from 'node:path'
import { createWriteStream, unlink } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import ffmpeg from 'fluent-ffmpeg'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 100_000_000_000, // 100mb
      },
    })
    if (!upload) {
      return reply.status(400).send()
    }

    const mimeTypeRegex = /^(image|video|audio)\/[a-zA-Z]+/;
    const isValidFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFormat) {
      return reply.status(400).send()
    }

    const fieldId = randomUUID()
    const extension = extname(upload.filename)
    const fileName = fieldId.concat(extension)
    const filePath = resolve(__dirname, '../../uploads', fileName)

    const writeStream = createWriteStream(filePath)
    await pump(upload.file, writeStream)

    let fileUrl: string

    if (upload.mimetype.startsWith('audio/')) {
      const compressedFilePath = await compressAudio(filePath)
      const compressedFileName = compressedFilePath.split('/').pop()
      const fullUrl = request.protocol.concat('://').concat(request.hostname)
      fileUrl = new URL(`/uploads/${compressedFileName}`, fullUrl).toString()
      await unlink(filePath, (err) => {
        if (err) throw err
      }) // Apaga o original
    } else if (upload.mimetype.startsWith('video/')) {
      const compressedFilePath = await compressVideo(filePath)
      const compressedFileName = compressedFilePath.split('/').pop()
      const fullUrl = request.protocol.concat('://').concat(request.hostname)
      fileUrl = new URL(`/uploads/${compressedFileName}`, fullUrl).toString()
      await unlink(filePath, (err) => {
        if (err) throw err
      }) // Apaga o original
    } else {
      const fullUrl = request.protocol.concat('://').concat(request.hostname)
      fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()
    }

    return { fileUrl }
  })
}

async function compressAudio(filePath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const compressedFilePath = filePath.replace(/\.[^/.]+$/, '_compressed.mp3')
    ffmpeg(filePath)
      .audioCodec('libmp3lame')
      .audioBitrate('96k')
      .output(compressedFilePath)
      .on('end', () => {
        resolve(compressedFilePath)
      })
      .on('error', (err, stdout, stderr) => {
        console.error('Error during audio compression:', err)
        console.error('ffmpeg stdout:', stdout)
        console.error('ffmpeg stderr:', stderr)
        reject(err)
      })
      .run()
  })
}

async function compressVideo(filePath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const compressedFilePath = filePath.replace(/\.[^/.]+$/, '_compressed.mp4')
    ffmpeg(filePath)
      .videoCodec('libx264')
      .size('854x480')
      .outputOptions('-crf 28') // Ajuste o valor do CRF conforme necessário
      .output(compressedFilePath)
      .on('end', () => {
        resolve(compressedFilePath)
      })
      .on('error', (err, stdout, stderr) => {
        console.error('Error during video compression:', err)
        console.error('ffmpeg stdout:', stdout)
        console.error('ffmpeg stderr:', stderr)
        reject(err)
      })
      .run()
  })
}
