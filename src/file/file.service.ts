import { Injectable } from '@nestjs/common';
import { PathLike } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileService {
  getDestinationPath(): string {
    return join(process.cwd(), 'storage', 'photos');
  }
  async upload(file: Express.Multer.File, fileName: string) {
    const path: PathLike = join(this.getDestinationPath(), fileName);
    return await writeFile(path, file.buffer);
  }
}
