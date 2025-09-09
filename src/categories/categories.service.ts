import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        userId_name: {
          userId,
          name: dto.name,
        },
      },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name '${dto.name}' already exists`,
      );
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        color: dto.color ?? null,
        userId,
      },
    });
    return category;
  }

  async findAll(userId: number) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    if (category.userId !== userId)
      throw new ForbiddenException('Access denied');
    return category;
  }

  async update(id: number, userId: number, dto: UpdateCategoryDto) {
    await this.findOne(id, userId);

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        color: dto.color ?? undefined,
      },
    });
    return updated;
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.task.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await this.prisma.category.delete({ where: { id } });
    return { success: true };
  }
}
