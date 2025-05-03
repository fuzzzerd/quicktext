describe('QuickText Add Panel', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should open the add panel when FAB is clicked', () => {
    cy.get('.fab').click(); // Changed selector
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').should(
      'be.visible'
    );
  });

  it('should add text to global collection', () => {
    cy.get('.fab').click(); // Changed selector
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'My awesome text'
    );
    cy.get('.sliding-panel.visible button').contains('Add').click(); // New selector targeting button by text
    cy.get('.item .details').should('contain.text', 'My awesome text');
  });

  it('should clear text and close panel on cancel', () => {
    cy.get('.fab').click(); // Changed selector
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'Should be cleared'
    );
    cy.get('.sliding-panel.visible button').contains('Cancel').click(); // New selector targeting button by text
    cy.get('.sliding-panel.visible').should('not.exist');
  });

  it('should delete text from global collection', () => {
    // add a new item
    cy.get('.fab').click(); // Changed selector
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'To be deleted'
    );
    cy.get('.sliding-panel.visible button').contains('Add').click(); // New selector targeting button by text
    // delete the item
    cy.get('.item')
      .contains('.details', 'To be deleted')
      .parent()
      .find('.icons button')
      .contains('❌')
      .click();
    // assert item is removed
    cy.contains('.item .details', 'To be deleted').should('not.exist');
  });
});
