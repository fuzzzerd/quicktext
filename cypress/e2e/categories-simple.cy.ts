describe('Category Management - Simple Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should create a category and see bottom bar', () => {
    // Create a single category
    cy.get('.icons button').contains('...').click();
    cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
    cy.get('.add-category-row .live-edit-name').type('Test');
    cy.get('.add-category-row .add-button').click();
    cy.get('.close-btn').click();

    // Add a template to trigger bottom bar
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Test template');
    cy.get('.sliding-panel.visible .category-chip').contains('Test').click();
    cy.get('.sliding-panel.visible button').contains('Add').click();

    // Check if bottom bar appears
    cy.get('.bottom-bar').should('exist');
  });

  it('should add and delete a category', () => {
    // Add category
    cy.get('.icons button').contains('...').click();
    cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
    cy.get('.add-category-row .live-edit-name').type('ToDelete');
    cy.get('.add-category-row .add-button').click();
    
    // Verify it exists
    cy.get('.category-item .live-edit-name').should('have.value', 'ToDelete');
    
    // Delete it
    cy.get('.category-item .delete-btn').click();
    cy.on('window:confirm', () => true);
    
    // Verify it's gone
    cy.get('.category-item').should('not.exist');
  });

  it('should create template with category', () => {
    // Create category
    cy.get('.icons button').contains('...').click();
    cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
    cy.get('.add-category-row .live-edit-name').type('Work');
    cy.get('.add-category-row .live-edit-icon').type('💼');
    cy.get('.add-category-row .add-button').click();
    cy.get('.close-btn').click();

    // Create template
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Work template');
    cy.get('.sliding-panel.visible .category-chip').contains('Work').click();
    cy.get('.sliding-panel.visible button').contains('Add').click();

    // Verify template exists
    cy.get('.item .details').should('contain.text', 'Work template');
  });
});