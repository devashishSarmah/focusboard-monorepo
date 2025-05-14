import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  // POST /tasks
  @Post() create(@Body() dto: CreateTaskDto) {
    return this.tasks.create(dto);
  }

  // GET /tasks
  @Get() findAll() {
    return this.tasks.findAll();
  }

  // PATCH /tasks/:id  { "status": "in-progress" }
  @Patch(':id') move(
    @Param('id') id: string,
    @Body() { status }: UpdateStatusDto,
  ) {
    return this.tasks.move(id, status);
  }

  // DELETE /tasks/:id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.tasks.remove(id);
    return { message: 'Task deleted' };
  }
}
