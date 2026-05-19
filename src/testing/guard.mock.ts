import { CanActivate } from '@nestjs/common';

const guardMock: CanActivate = {
  canActivate: jest.fn().mockReturnValue(true),
};

export default guardMock;
