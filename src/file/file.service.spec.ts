import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { getPhoto } from '../testing/get-photo.mock';

describe('FileService', () => {
  let fileService: FileService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  test('validar a definição', () => {
    expect(fileService).toBeDefined();
  });

  describe('fileservice test', () => {
    test('method upload', async () => {
      const photo = await getPhoto();
      const fileName = `photo-test.png`;
      await fileService.upload(photo, fileName);
    });
  });
});
