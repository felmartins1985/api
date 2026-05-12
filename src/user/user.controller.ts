import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() body) {
    return {
      body,
    };
  }

  @Get()
  async list() {
    return { user: [] };
  }

  @Get(':id')
  async show(@Param() params) {
    return { user: {}, params };
  }

  @Put(':id')
  async update(@Param() params, @Body() body) {
    return { method: 'PUT', params, body };
  }

  @Patch(':id')
  async updatePartial(@Param() params, @Body() body) {
    return { method: 'PATCH', params, body };
  }

  @Delete(':id')
  async delete(@Param() params) {
    return { params };
  }
}
