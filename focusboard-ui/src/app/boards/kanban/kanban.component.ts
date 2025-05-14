import { Component, OnInit } from '@angular/core';
import { Task, TasksService } from '../../services/tasks.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Column {
  status: Task['status'];
  label: string;
}

@Component({
  selector: 'app-kanban',
  imports: [DragDropModule, NgFor, FormsModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent implements OnInit {
  columns: Column[] = [
    { status: 'todo', label: 'To Do' },
    { status: 'in-progress', label: 'In Progress' },
    { status: 'done', label: 'Done' },
  ];

  statusMap = this.columns.map((c) => c.status);

  tasksByStatus: Record<string, Task[]> = {};
  newTitle = '';

  constructor(private api: TasksService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.api.list().subscribe((tasks) => {
      this.tasksByStatus = {
        todo: tasks.filter((t) => t.status === 'todo'),
        'in-progress': tasks.filter((t) => t.status === 'in-progress'),
        done: tasks.filter((t) => t.status === 'done'),
      };
    });
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    const fromStatus = event.previousContainer.id as Task['status'];
    const toStatus = event.container.id as Task['status'];

    if (fromStatus === toStatus) return;

    const task = event.previousContainer.data[event.previousIndex];
    this.api.move(task.id, toStatus).subscribe(() => this.load());
  }

  add() {
    if (!this.newTitle.trim()) return;
    this.api.create(this.newTitle.trim()).subscribe(() => {
      this.newTitle = '';
      this.load();
    });
  }
}
