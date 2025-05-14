import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks.service';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_ENDPOINT } from '../app.token';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: API_BASE_ENDPOINT,
          useValue: 'http://localhost:3000/tasks',
        },
      ],
    });
    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
