import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? 'TODO',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        userId: userId,
        ...(dto.categoryId && { categoryId: dto.categoryId }),
      },
    });
  }

  async findAll(
    userId: number,
    page: number = 1,
    limit: number = 5,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: { userId: number; OR?: any[] } = { userId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { status: { equals: search.toUpperCase() } },
      ];
    }

    return this.prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) {
      throw new ForbiddenException('You cannot access this task');
    }

    return task;
  }

  async update(id: number, userId: number, dto: UpdateTaskDto) {
    const task = await this.findOne(id, userId);

    const updatedTask = await this.prisma.task.update({
      where: { id: task.id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : task.dueDate,
      },
    });

    return {
      message: 'Task updated successfully',
      task: updatedTask,
    };
  }

  async remove(id: number, userId: number) {
    const task = await this.findOne(id, userId);

    await this.prisma.task.delete({
      where: { id: task.id },
    });

    return { message: 'Task deleted successfully' };
  }
}
