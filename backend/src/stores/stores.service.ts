import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user-roles.enum';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    private usersService: UsersService, 
  ) {}

  // 1. Create Store (Admin Only)
  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const { ownerId, ...rest } = createStoreDto;

    // Validate that the owner exists and has the correct role
    const owner = await this.usersService.findOne(ownerId);
    if (owner.role !== UserRole.STORE_OWNER) {
      throw new ConflictException('The assigned user must have the role of Store Owner');
    }

    // Check if this user already has a store (1-to-1 constraint)
    const existingStore = await this.storesRepository.findOne({ where: { owner: { id: ownerId } } });
    if (existingStore) {
      throw new ConflictException('This user is already assigned to a store');
    }

    const store = this.storesRepository.create({
      ...rest,
      owner,
    });

    return this.storesRepository.save(store);
  }

  // 2. Find All (Search & Filter)
  async findAll(query?: { name?: string; address?: string }): Promise<Store[]> {
    const where: any = {};

    if (query?.name) where.name = Like(`%${query.name}%`);
    if (query?.address) where.address = Like(`%${query.address}%`);

    return this.storesRepository.find({
      where,
      order: { avgRating: 'DESC' }, 
      relations: ['owner'], 
    });
  }

  // 3. Find One by ID
  async findOne(id: string): Promise<Store> {
    const store = await this.storesRepository.findOne({ 
      where: { id },
      relations: ['owner'] 
    });
    if (!store) throw new NotFoundException(`Store with ID ${id} not found`);
    return store;
  }
  
  // 4. Find One by Owner ID (For Store Owner Dashboard)
  async findByOwner(ownerId: string): Promise<Store | null> {
      const store = await this.storesRepository.findOne({ 
        where: { owner: { id: ownerId } } 
      });
      // It's possible a store owner doesn't have a store assigned yet
      return store;
  }
  // 5. Update Store
  async update(id: string, attrs: Partial<Store>): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, attrs);
    return this.storesRepository.save(store);
  }

  // 6. Remove Store
  async remove(id: string): Promise<void> {
    const store = await this.findOne(id);
    await this.storesRepository.remove(store);
  }
}