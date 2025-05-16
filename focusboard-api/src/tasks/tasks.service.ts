import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { ALL_STATUSES, TaskStatus } from './task-status.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly repo: Repository<Task>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  private readonly cacheKey = 'tasks:all';

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.repo.create({ ...dto, status: TaskStatus.TODO });
    const saved = await this.repo.save(task);
    await this.cache.del(this.cacheKey);
    return saved;
  }

  async findAll(): Promise<Task[]> {
    let tasks = await this.cache.get<Task[]>(this.cacheKey);
    if (!tasks) {
      tasks = await this.repo.find({ order: { createdAt: 'DESC' } });
      await this.cache.set(this.cacheKey, tasks);
    }
    return tasks;
  }

  async move(id: string, status: TaskStatus): Promise<Task> {
    if (!ALL_STATUSES.includes(status)) {
      throw new NotFoundException(`Invalid status: ${status}`);
    }
    const task = await this.repo.preload({ id, status });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    const updated = await this.repo.save(task);
    await this.cache.del(this.cacheKey);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException(`Task ${id} not found`);
    await this.cache.del(this.cacheKey);
  }
}
