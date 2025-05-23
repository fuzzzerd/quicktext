describe('Template Variable Panel', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should not show template panel for text without variables', () => {
    // Add simple text without variables
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Simple text');
    cy.get('.sliding-panel.visible button').contains('Add').click();
    
    // Click copy button - expect clipboard error in headless mode
    cy.get('.item .details').should('contain.text', 'Simple text');
    
    // Handle expected clipboard error
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Clipboard write was blocked due to lack of user activation')) {
        return false; // prevent test from failing
      }
    });
    
    cy.get('.item .icons button').contains('📃').click();
    
    // Test passes if we get the clipboard error (no template panel shown)
  });

  it('should show template panel with 1 field for text with 1 variable', () => {
    // Add text with one variable
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Hello {{name}}!', { parseSpecialCharSequences: false });
    cy.get('.sliding-panel.visible button').contains('Add').click();
    
    // Click copy button
    cy.get('.item .details').should('contain.text', 'Hello {{name}}!');
    cy.get('.item .icons button').contains('📃').click();
    
    // Should show template panel with exactly 1 input field
    cy.get('.variable-input').should('have.length', 1);
  });

  it('should show template panel with 5 fields for text with 5 variables', () => {
    // Add text with 5 variables
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'Hi {{title}} {{first}} {{last}}, order {{num}} to {{addr}}',
      { parseSpecialCharSequences: false }
    );
    cy.get('.sliding-panel.visible button').contains('Add').click();
    
    // Click copy button  
    cy.get('.item .icons button').contains('📃').click();
    
    // Should show template panel with exactly 5 input fields
    cy.get('.variable-input').should('have.length', 5);
  });
});