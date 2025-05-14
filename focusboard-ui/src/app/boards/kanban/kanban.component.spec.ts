import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanComponent } from './kanban.component';
import { Task, TasksService } from '../../services/tasks.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('KanbanComponent', () => {
  let component: KanbanComponent;
  let fixture: ComponentFixture<KanbanComponent>;
  let mockApi: jasmine.SpyObj<TasksService>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'T1',
      status: 'todo',
      createdAt: '',
      assigneeId: undefined,
    },
    {
      id: '2',
      title: 'T2',
      status: 'in-progress',
      createdAt: '',
      assigneeId: undefined,
    },
  ];

  beforeEach(async () => {
    mockApi = jasmine.createSpyObj('TasksService', [
      'list',
      'create',
      'move',
      'remove',
    ]);
    mockApi.list.and.returnValue(of(mockTasks));
    mockApi.create.and.returnValue(
      of({
        id: '3',
        title: 'T3',
        status: 'todo',
        createdAt: '',
        assigneeId: undefined,
      })
    );
    mockApi.move.and.returnValue(of({} as Task));
    mockApi.remove.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [KanbanComponent],
      providers: [
        { provide: TasksService, useValue: mockApi },
        provideHttpClient(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render column headers with correct counts', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('To Do (1)');
    expect(compiled.textContent).toContain('In Progress (1)');
    expect(compiled.textContent).toContain('Done (0)');
  });

  it('should display task titles in their columns', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('T1');
    expect(compiled.textContent).toContain('T2');
  });

  it('should add a new task when add() is called', () => {
    component.newTitle = 'T3';
    component.add();
    expect(mockApi.create).toHaveBeenCalledWith('T3');
  });

  it('should move a task on drop', () => {
    // Simulate drag-drop from todo → done:
    const event: any = {
      previousContainer: {
        id: 'todo',
        data: mockTasks.filter((t) => t.status === 'todo'),
      },
      container: { id: 'done', data: [] },
      previousIndex: 0,
      currentIndex: 0,
    };
    component.onDrop(event);
    expect(mockApi.move).toHaveBeenCalledWith('1', 'done');
  });
});
