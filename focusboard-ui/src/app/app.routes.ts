import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./boards/kanban/kanban.component').then((c) => c.KanbanComponent),
  },
];
