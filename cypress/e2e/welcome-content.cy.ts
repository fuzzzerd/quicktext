describe('Welcome Content Panel', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should show welcome content when there are no templates', () => {
    // Welcome content should be visible when no templates exist
    cy.get('.welcome-container').should('be.visible');
    cy.contains('Welcome to QuickText!').should('be.visible');
    cy.contains('Your privacy-first, offline text snippet manager').should('be.visible');
    cy.contains('Getting Started').should('be.visible');
    cy.contains('Add Your First Text Snippet').should('be.visible');
  });

  it('should hide welcome content and show snippets after adding first template', () => {
    // Verify welcome content is initially visible
    cy.get('.welcome-container').should('be.visible');
    
    // Add the first template
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('My first template');
    cy.get('.sliding-panel.visible button').contains('Add').click();
    
    // Welcome content should disappear
    cy.get('.welcome-container').should('not.exist');
    
    // Template should be visible in the list
    cy.get('.item .details').should('contain.text', 'My first template');
  });

  it('should show welcome content again after removing all templates', () => {
    // Add a template first
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Temporary template');
    cy.get('.sliding-panel.visible button').contains('Add').click();
    
    // Verify welcome content is hidden and template is visible
    cy.get('.welcome-container').should('not.exist');
    cy.get('.item .details').should('contain.text', 'Temporary template');
    
    // Remove the template
    cy.get('.item')
      .contains('.details', 'Temporary template')
      .parent()
      .find('.icons button')
      .contains('❌')
      .click();
    
    // Welcome content should appear again
    cy.get('.welcome-container').should('be.visible');
    cy.contains('Welcome to QuickText!').should('be.visible');
  });

  it('should trigger add text when welcome CTA button is clicked', () => {
    // Click the welcome CTA button
    cy.get('.add-text-btn').contains('Add Your First Text Snippet').click();
    
    // Should open the add panel
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').should('be.visible');
  });

  it('should show demo feedback when demo button is clicked', () => {
    // Click the interactive demo button
    cy.get('.demo-btn.interactive').click();
    
    // Should show demo feedback message
    cy.get('.demo-feedback').should('be.visible');
    cy.get('.demo-feedback').should('contain.text', 'Text copied to demo clipboard! ✅');
    
    // Demo feedback should disappear after timeout
    cy.get('.demo-feedback', { timeout: 3000 }).should('not.exist');
  });
});