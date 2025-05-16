describe('FocusBoard Kanban Flow', () => {
  before(() => {
    // clear all tasks
    cy.request('GET', 'http://localhost:3000/tasks')
      .its('body')
      .then((tasks: any[]) => {
        for (let task of tasks) {
          cy.request('DELETE', `http://localhost:3000/tasks/${task.id}`);
        }
      });
  });

  it('creates, moves, and deletes a task', () => {
    // Visit the app
    cy.visit('http://localhost:4200');

    // Create
    cy.get('input[placeholder="New task…"]').type('E2E Task');
    cy.contains('Add').click();
    cy.contains('.board h3', 'To Do (1)');
    cy.contains('.card', 'E2E Task');

    // Move to In Progress
    cy.dragCard(0, 1);

    cy.contains('.board h3', 'In Progress (1)');

    // Delete via API cleanup
    cy.request('GET', 'http://localhost:3000/tasks')
      .its('body')
      .then((tasks: any[]) => {
        cy.request('DELETE', `http://localhost:3000/tasks/${tasks[0].id}`);
      });
  });
});
