import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

describe('TasksService', () => {
  let service: TasksService;
  let repo: Repository<Task>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Task],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Task]),
      ],
      providers: [TasksService],
    }).compile();

    service = module.get(TasksService);
    repo = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('creates and retrieves a task', async () => {
    const created = await service.create({ title: 'Test' });
    expect(created.id).toBeDefined();
    const all = await service.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe('Test');
  });
});
