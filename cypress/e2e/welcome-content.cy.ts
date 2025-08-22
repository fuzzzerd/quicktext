['localStorage', 'indexedDB'].forEach(storageType => {
  describe(`Welcome Content Panel - ${storageType}`, () => {
    beforeEach(() => {
      cy.clearAllStorage();
      cy.setStorageTypeAndWait(storageType);
      cy.visit('/');
    });

  it('should show welcome content when there are no templates', () => {
    // Welcome content should be visible in main area when no templates exist
    cy.get('main .welcome-container').should('be.visible');
    cy.get('main').contains('Welcome to QuickText!').should('be.visible');
    cy.get('main')
      .contains('Your privacy-first, offline text snippet manager')
      .should('be.visible');
    cy.get('main').contains('Getting Started').should('be.visible');
    cy.get('main').contains('Add Your First Text Snippet').should('be.visible');
  });

  it('should hide welcome content and show snippets after adding first template', () => {
    // Verify welcome content is initially visible in main area
    cy.get('main .welcome-container').should('be.visible');

    // Add the first template
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'My first template'
    );
    cy.get('.sliding-panel.visible button').contains('Add').click();

    // Welcome content should disappear from main area
    cy.get('main .welcome-container').should('not.exist');

    // Template should be visible in the list
    cy.get('.item .details').should('contain.text', 'My first template');
  });

  it('should show welcome content again after removing all templates', () => {
    // Add a template first
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'Temporary template'
    );
    cy.get('.sliding-panel.visible button').contains('Add').click();

    // Verify welcome content is hidden from main area and template is visible
    cy.get('main .welcome-container').should('not.exist');
    cy.get('.item .details').should('contain.text', 'Temporary template');

    // Remove the template - click to open edit panel first
    cy.get('.item .details').contains('Temporary template').click();
    
    // Delete via edit panel
    cy.get('.sliding-panel.visible .delete-link').click();
    cy.on('window:confirm', () => true);

    // Welcome content should appear again in main area
    cy.get('main .welcome-container').should('be.visible');
    cy.get('main').contains('Welcome to QuickText!').should('be.visible');
  });

  it('should trigger add text when welcome CTA button is clicked', () => {
    // Verify welcome content is visible in main area first
    cy.get('main .welcome-container').should('be.visible');

    // Click the welcome CTA button in main area
    cy.get('main .add-text-btn')
      .contains('Add Your First Text Snippet')
      .click();

    // Should open the add panel
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').should(
      'be.visible'
    );
  });

  it('should show demo feedback when demo button is clicked', () => {
    // Verify welcome content is visible in main area first
    cy.get('main .welcome-container').should('be.visible');

    // Click the interactive demo button in main area
    cy.get('main .demo-btn.interactive').click();

    // Should show demo feedback message in main area
    cy.get('main .demo-feedback').should('be.visible');
    cy.get('main .demo-feedback').should(
      'contain.text',
      'Text copied to demo clipboard! ✅'
    );

    // Demo feedback should disappear after timeout
    cy.get('main .demo-feedback', { timeout: 3000 }).should('not.exist');
  });

  it('should show welcome content from settings help menu', () => {
    // Add a snippet first so welcome content is normally hidden from main area
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'Existing snippet'
    );
    cy.get('.sliding-panel.visible button').contains('Add').click();

    // Wait for add panel to close and snippet to appear
    cy.get('.sliding-panel.visible').should('not.exist');
    cy.get('.item .details').should('contain.text', 'Existing snippet');
    cy.get('main .welcome-container').should('not.exist');

    // Open settings menu using the three dots button
    cy.get('.icons button').contains('...').click();

    // Verify settings menu opened and contains Help option
    cy.get('.sliding-panel.visible ul').should('be.visible');
    cy.get('.sliding-panel.visible ul li')
      .contains('Help')
      .should('be.visible');

    // Click Help option
    cy.get('.sliding-panel.visible ul li').contains('Help').click();

    // Welcome content should exist in the help panel
    cy.get('.sliding-panel.visible .welcome-container').should('exist');
    cy.get('.sliding-panel.visible .welcome-container')
      .contains('Welcome to QuickText!')
      .should('exist');
  });
});
});
