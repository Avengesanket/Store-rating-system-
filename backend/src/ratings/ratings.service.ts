import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  // 1. Submit or Update Rating
  async upsert(userId: string, createRatingDto: CreateRatingDto) {
    const { storeId, value } = createRatingDto;

    // Check if rating already exists for this user+store
    let rating = await this.ratingsRepository.findOne({
      where: {
        user: { id: userId },
        store: { id: storeId },
      },
      relations: ['store'],
    });

    if (rating) {
      // Update existing
      rating.value = value;
    } else {
      // Create new
      // We need to fetch the store entity first to link it
      const store = await this.storesRepository.findOne({ where: { id: storeId } });
      if (!store) throw new NotFoundException('Store not found');

      rating = this.ratingsRepository.create({
        user: { id: userId } as User, 
        store,
        value,
      });
    }

    // Save the rating
    const savedRating = await this.ratingsRepository.save(rating);

    // TRIGGER: Recalculate Average for this Store
    await this.updateStoreAverage(storeId);

    return savedRating;
  }

  // 2. Helper: Recalculate Average
  private async updateStoreAverage(storeId: string) {
    // Calculate average using SQL query
    const { avg } = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.value)', 'avg')
      .where('rating.storeId = :storeId', { storeId })
      .getRawOne();

    // Update Store entity
    await this.storesRepository.update(storeId, {
      avgRating: parseFloat(avg) || 0,
    });
  }

  // 3. Get Ratings for a Store (For Store Owner Dashboard)
  async findAllByStore(storeId: string) {
    return this.ratingsRepository.find({
      where: { store: { id: storeId } },
      relations: ['user'], // Include user details so Owner sees WHO rated
      order: { createdAt: 'DESC' },
    });
  }
  
  // 4. Get My Rating for a specific Store (For Normal User UI)
  async findUserRatingForStore(userId: string, storeId: string) {
      return this.ratingsRepository.findOne({
          where: {
              user: { id: userId },
              store: { id: storeId }
          }
      });
    }
    async countAll(): Promise<number> {
    return this.ratingsRepository.count();
  }
}