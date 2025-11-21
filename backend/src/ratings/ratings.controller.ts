import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-roles.enum';

@Controller('ratings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  // Normal User: Rate a store
  @Post()
  @Roles(UserRole.NORMAL_USER)
  createOrUpdate(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.upsert(req.user.userId, createRatingDto);
  }

  @Get('count')
  @Roles(UserRole.ADMIN)
  countAll() {
    return this.ratingsService.countAll();
  }

  // Store Owner: View ratings for MY store
  @Get('store/:storeId')
  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN)
  findAllByStore(@Param('storeId') storeId: string) {
    return this.ratingsService.findAllByStore(storeId);
  }
  
  // Normal User: Check what I rated this store (so the UI can show 4 stars if I previously gave 4)
  @Get('my-rating/:storeId')
  @Roles(UserRole.NORMAL_USER)
  findMyRating(@Request() req, @Param('storeId') storeId: string) {
      return this.ratingsService.findUserRatingForStore(req.user.userId, storeId);
  }
}