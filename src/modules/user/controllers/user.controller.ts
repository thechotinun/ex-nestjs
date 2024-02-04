import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { PaginateQuery } from '@common/dto/paginate.query';
import { ApiResource } from '@common/reponses/api-resource';
import { UserService } from '../services/user.service';
import { UseResources } from 'interceptors/use-resources.interceptor';
import { UserResourceDto } from '@modules/user/resources/user.resource';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseResources(UserResourceDto)
  async paginate(
    @Query() { page, limit }: PaginateQuery,
  ): Promise<ApiResource> {
    try {
      const reponse = await this.userService.paginate({
        page,
        limit,
      });

      return ApiResource.successResponse(reponse);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }

  @Post()
  async create(@Body() payload: CreateUserDto): Promise<ApiResource> {
    try {
      const response = await this.userService.create(payload);

      return ApiResource.successResponse(response);
    } catch (error) {
      return ApiResource.errorResponse(error);
    }
  }
}
