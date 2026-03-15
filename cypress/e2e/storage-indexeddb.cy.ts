describe('IndexedDB Storage', () => {
  beforeEach(() => {
    cy.clearAllStorage();
    cy.setStorageTypeAndWait('indexedDB');
    cy.visit('/');
  });

  it('should add and persist a template', () => {
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('IndexedDB template');
    cy.get('.sliding-panel.visible button').contains('Add').click();

    cy.get('.item .details').should('contain.text', 'IndexedDB template');

    cy.reload();

    cy.get('.item .details').should('contain.text', 'IndexedDB template');
  });

  it('should add and persist a category', () => {
    cy.get('.icons button').contains('...').click();
    cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
    cy.get('.add-category-row .live-edit-name').type('IDB Category');
    cy.get('.add-category-row .add-button').click();
    cy.get('.sliding-panel.visible .close-btn').click();

    cy.reload();

    cy.get('.icons button').contains('...').click();
    cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
    cy.get('.category-item .live-edit-name').should('have.value', 'IDB Category');
  });

  it('should add and persist a value list', () => {
    // Create template with variable
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'Status: {{status}}',
      { parseSpecialCharSequences: false }
    );
    cy.get('.sliding-panel.visible button').contains('Add').click();

    // Add values
    cy.get('.icons button').contains('...').click();
    cy.get('.sliding-panel.visible ul li').contains('Manage Value Lists').click();
    cy.get('.sliding-panel.visible .variable-label').contains('status').click();
    cy.get('.sliding-panel.visible .values-section .add-value-row input').type('Open');
    cy.get('.sliding-panel.visible .values-section .add-value-row .add-value-button').click();
    cy.get('.sliding-panel.visible .close-btn').click();

    cy.reload();

    // Verify persisted
    cy.get('.icons button').contains('...').click();
    cy.get('.sliding-panel.visible ul li').contains('Manage Value Lists').click();
    cy.get('.sliding-panel.visible .count-badge').should('contain.text', '1');
  });
});
