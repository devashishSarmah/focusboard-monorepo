/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// cypress/support/commands.ts
Cypress.Commands.add(
  'dragCard',
  { prevSubject: false },
  (cardIdx: number, columnIdx: number) => {
    // 1. Grab all cards and columns
    const cards = Cypress.$('.card');
    const columns = Cypress.$('.column');

    if (!(cardIdx in cards))
      throw new Error(
        `No card at index ${cardIdx}. Got ${cards.length} cards.`
      );
    if (!(columnIdx in columns))
      throw new Error(
        `No column at index ${columnIdx}. Got ${columns.length} columns.`
      );

    // 2. Get DOMRects
    const cardRect = cards[cardIdx].getBoundingClientRect();
    const columnRect = columns[columnIdx].getBoundingClientRect();

    // 3. Build coordinate options
    const opts = (rect: DOMRect, offset = 5) => ({
      button: 0,
      clientX: rect.left + rect.width / 2 + offset,
      clientY: rect.top + rect.height / 2 + offset,
      screenX: rect.left + offset,
      screenY: rect.top + offset,
      pageX: rect.left + offset,
      pageY: rect.top + offset,
    });

    // 4. Fire the sequence
    cy.wrap(cards[cardIdx])
      .trigger('mousedown', opts(cardRect))
      .trigger('mousemove', opts(cardRect, 10)); // kick off drag
    cy.wait(50);
    cy.get('.column')
      .eq(columnIdx)
      .trigger('mousemove', opts(columnRect, 10))
      .trigger('mouseup', opts(columnRect, 10));
  }
);

// Add typing to global namespace:
declare global {
  namespace Cypress {
    interface Chainable {
      dragCard(cardIdx: number, columnIdx: number): Chainable;
    }
  }
}

export {}; // Indicate to compiler that this file is a module
