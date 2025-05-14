export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export const ALL_STATUSES = Object.values(TaskStatus) as TaskStatus[];
