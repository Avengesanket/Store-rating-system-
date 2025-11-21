import { Controller, Get, Post, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { Delete, Patch } from '@nestjs/common';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // Only Admin can create stores
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Query('name') name?: string,
    @Query('address') address?: string,
  ) {
    return this.storesService.findAll({ name, address });
  }

  @Get('my-store')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.STORE_OWNER)
  async findMyStore(@Request() req) {
    const userId = req.user.userId;
    return this.storesService.findByOwner(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN) 
  update(@Param('id') id: string, @Body() body: any) {
    return this.storesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN) 
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}