describe('PIN Functionality', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');

    // Create category with PIN protection
    cy.get('.icons button').contains('...').click();
    cy.get('.sliding-panel.visible ul li')
      .contains('Manage Categories')
      .click();

    // Add category with PIN
    cy.get('.add-category-row .live-edit-name').type('Protected');
    cy.get('.add-category-row .live-edit-icon').type('🔒');
    cy.get('.add-category-row .live-edit-pin').type('1234');
    cy.get('.add-category-row .add-button').click();

    // Add category without PIN
    cy.get('.add-category-row .live-edit-name').type('Public');
    cy.get('.add-category-row .live-edit-icon').type('📂');
    cy.get('.add-category-row .add-button').click();

    // Close category manager
    cy.get('.close-btn').click();

    // Create template for protected category
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'Protected template content'
    );
    cy.get('.sliding-panel.visible .category-chip')
      .contains('Protected')
      .click();
    cy.get('.sliding-panel.visible button').contains('Add').click();

    // Create template for public category
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'Public template content'
    );
    cy.get('.sliding-panel.visible .category-chip').contains('Public').click();
    cy.get('.sliding-panel.visible button').contains('Add').click();
  });

  it('should prompt for PIN when switching to pin-protected category', () => {
    // Switch to the pin-protected category
    cy.get('.bottom-bar button').contains('🔒').click();

    // Should show PIN entry panel
    cy.get('.sliding-panel.visible .pin-form').should('be.visible');
    cy.get('.sliding-panel.visible h3').should('contain.text', 'Enter PIN');
    cy.get('.sliding-panel.visible .category-name').should(
      'contain.text',
      'Protected'
    );
    cy.get('.sliding-panel.visible .pin-input').should('be.visible');

    // Category should be active but templates should not be visible yet
    cy.get('.pin-required-message').should('be.visible');
    cy.get('.pin-required-message h3').should(
      'contain.text',
      'Category Protected'
    );
  });

  it('should show templates after entering correct PIN', () => {
    // Switch to the pin-protected category
    cy.get('.bottom-bar button').contains('🔒').click();

    // Enter correct PIN
    cy.get('.sliding-panel.visible .pin-input').type('1234');
    cy.get('.sliding-panel.visible button').contains('Access Category').click();

    // PIN panel should close
    cy.get('.sliding-panel.visible .pin-form').should('not.exist');

    // Should now see the protected template
    cy.get('.item .details').should(
      'contain.text',
      'Protected template content'
    );
    cy.get('.item').should('have.length', 1);

    // Pin required message should not be visible
    cy.get('.pin-required-message').should('not.exist');
  });

  it('should show error message for invalid PIN', () => {
    // Switch to the pin-protected category
    cy.get('.bottom-bar button').contains('🔒').click();

    // Enter incorrect PIN
    cy.get('.sliding-panel.visible .pin-input').type('9999');
    cy.get('.sliding-panel.visible button').contains('Access Category').click();

    // Should show error message
    cy.get('.sliding-panel.visible .error-message').should('be.visible');
    cy.get('.sliding-panel.visible .error-message').should(
      'contain.text',
      'Incorrect PIN'
    );

    // PIN input should be cleared
    cy.get('.sliding-panel.visible .pin-input').should('have.value', '');

    // PIN panel should still be visible
    cy.get('.sliding-panel.visible .pin-form').should('be.visible');

    // Templates should still not be visible
    cy.get('.pin-required-message').should('be.visible');
  });

  it('should work correctly when switching between pin-protected and public categories', () => {
    // Start with public category - should work without PIN
    cy.get('.bottom-bar button').contains('📂').click();
    cy.get('.item .details').should('contain.text', 'Public template content');
    cy.get('.item').should('have.length', 1);

    // Switch to protected category - should prompt for PIN
    cy.get('.bottom-bar button').contains('🔒').click();
    cy.get('.sliding-panel.visible .pin-form').should('be.visible');

    // Enter correct PIN
    cy.get('.sliding-panel.visible .pin-input').type('1234');
    cy.get('.sliding-panel.visible button').contains('Access Category').click();

    // Should see protected template
    cy.get('.item .details').should(
      'contain.text',
      'Protected template content'
    );
    cy.get('.item').should('have.length', 1);

    // Switch back to public category - should work immediately
    cy.get('.bottom-bar button').contains('📂').click();
    cy.get('.item .details').should('contain.text', 'Public template content');
    cy.get('.item').should('have.length', 1);

    // No PIN prompt should appear
    cy.get('.sliding-panel.visible .pin-form').should('not.exist');
  });

  it('should cancel PIN entry and show locked message', () => {
    // Switch to the pin-protected category
    cy.get('.bottom-bar button').contains('🔒').click();

    // Cancel PIN entry
    cy.get('.sliding-panel.visible button').contains('Cancel').click();

    // PIN panel should close
    cy.get('.sliding-panel.visible .pin-form').should('not.exist');

    // Should show pin required message with unlock button
    cy.get('.pin-required-message').should('be.visible');
    cy.get('.pin-required-message h3').should(
      'contain.text',
      'Category Protected'
    );
    cy.get('.pin-required-message .unlock-btn').should(
      'contain.text',
      'Enter PIN'
    );

    // Templates should not be visible
    cy.get('.item').should('not.exist');
  });

  it('should re-prompt for PIN after clicking unlock button', () => {
    // Switch to the pin-protected category and cancel PIN entry
    cy.get('.bottom-bar button').contains('🔒').click();
    cy.get('.sliding-panel.visible button').contains('Cancel').click();

    // Click unlock button
    cy.get('.pin-required-message .unlock-btn').click();

    // Should show PIN entry panel again
    cy.get('.sliding-panel.visible .pin-form').should('be.visible');
    cy.get('.sliding-panel.visible h3').should('contain.text', 'Enter PIN');

    // Enter correct PIN this time
    cy.get('.sliding-panel.visible .pin-input').type('1234');
    cy.get('.sliding-panel.visible button').contains('Access Category').click();

    // Should now see the protected template
    cy.get('.item .details').should(
      'contain.text',
      'Protected template content'
    );
  });

  it('should show PIN indicator on protected category button', () => {
    // Check that the protected category button has the has-pin class and pin indicator
    cy.get('.bottom-bar button.has-pin')
      .should('contain.text', '🔒')
      .find('.pin-indicator')
      .should('be.visible')
      .should('contain.text', '🔒');

    // Check that the public category does not have a lock indicator
    cy.get('.bottom-bar button')
      .contains('📂')
      .should('not.have.class', 'has-pin')
      .find('.pin-indicator')
      .should('not.exist');
  });

  it('should require PIN after switching categories multiple times', () => {
    // First authorize the protected category
    cy.get('.bottom-bar button').contains('🔒').click();
    cy.get('.sliding-panel.visible .pin-input').type('1234');
    cy.get('.sliding-panel.visible button').contains('Access Category').click();
    cy.get('.item .details').should(
      'contain.text',
      'Protected template content'
    );

    // Switch to public category
    cy.get('.bottom-bar button').contains('📂').click();
    cy.get('.item .details').should('contain.text', 'Public template content');

    // Switch back to protected category - should require PIN again
    cy.get('.bottom-bar button').contains('🔒').click();
    cy.get('.sliding-panel.visible .pin-form').should('be.visible');
    cy.get('.sliding-panel.visible h3').should('contain.text', 'Enter PIN');
  });
});
