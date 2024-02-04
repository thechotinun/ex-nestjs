import { BaseResourceDto } from '@common/resources/base.resource';
import { ResourceWithPaginateDto } from '@common/resources/paginate.resource';
import { Expose, Type } from 'class-transformer';

export class UserDto extends BaseResourceDto {
  @Expose()
  email: string;
}

export class UserResourceDto extends ResourceWithPaginateDto {
  @Expose()
  @Type(() => UserDto)
  data: UserDto;
}
