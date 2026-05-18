import { Role } from '../enums/role.enum';
import { UpdatePatchUserDto } from '../user/dto/update-patch-user.dto';

export const updatePatchUserDto: UpdatePatchUserDto = {
  role: Role.ADMIN,
};
