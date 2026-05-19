import { createReadStream, ReadStream } from 'fs';

export const getFileToBuffer = (filename: string) => {
  const readStream = createReadStream(filename);

  const chunks: Buffer[] = [];

  return new Promise<{
    buffer: Buffer;
    stream: ReadStream;
  }>((resolve, reject) => {
    readStream.on('data', (chunk: string | Buffer) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });

    readStream.on('error', reject);

    readStream.on('close', () => {
      resolve({
        buffer: Buffer.concat(chunks),
        stream: readStream,
      });
    });
  });
};
