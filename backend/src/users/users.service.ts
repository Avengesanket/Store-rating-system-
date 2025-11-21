import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminEmail = 'admin@store.com';
    const adminExists = await this.usersRepository.findOne({ where: { email: adminEmail } 
    });
    
    if (!adminExists) {
      console.log('Seeding initial Admin user...');
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      
      await this.usersRepository.save({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        address: 'System HQ',
        role: UserRole.ADMIN
      });
      console.log(`Admin created: ${adminEmail} / Admin@123`);
    }
  }
  // 1. Create User (Sign up / Add User)
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    // Check if email exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    return this.usersRepository.save(user);
  }

  // 2. Find All Users (With Filter capability for Admin)
  async findAll(filters?: { name?: string; email?: string; address?: string; role?: string }): Promise<User[]> {
    const where: any = {};

    // Apply partial matching (LIKE) for search filters
    if (filters?.name) where.name = Like(`%${filters.name}%`);
    if (filters?.email) where.email = Like(`%${filters.email}%`);
    if (filters?.address) where.address = Like(`%${filters.address}%`);
    if (filters?.role) where.role = filters.role;

    return this.usersRepository.find({
      where,
      order: { createdAt: 'DESC' }, // Show newest users first
    });
  }

  // 3. Find One by ID
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // 4. Find One by Email (Helper for Auth Login)
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
  // 5. Update User
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // Clone update DTO to a plain object so we can safely manipulate dynamic fields like password
    const updates: any = { ...updateUserDto };

    // If password is being updated, hash it again
    const plainPassword = updates.password;
    if (plainPassword) {
      const salt = await bcrypt.genSalt();
      updates.password = await bcrypt.hash(plainPassword, salt);
    }

    Object.assign(user, updates);
    return this.usersRepository.save(user);
  }

  // 6. Remove User (Optional utility)
  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}