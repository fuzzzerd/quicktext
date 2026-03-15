describe('QuickText Add Panel', () => {
  beforeEach(() => {
    cy.clearAllStorage();
    cy.setStorageTypeAndWait('localStorage');
    cy.visit('/');
  });

  it('should open the add panel when FAB is clicked', () => {
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').should(
      'be.visible'
    );
  });

  it('should add text to global collection', () => {
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'My awesome text'
    );
    cy.get('.sliding-panel.visible button').contains('Add').click();
    cy.get('.item .details').should('contain.text', 'My awesome text');
  });

  it('should clear text and close panel on cancel', () => {
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'Should be cleared'
    );
    cy.get('.sliding-panel.visible button').contains('Cancel').click();
    cy.get('.sliding-panel.visible').should('not.exist');
  });

  it('should delete text from global collection', () => {
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(
      'To be deleted'
    );
    cy.get('.sliding-panel.visible button').contains('Add').click();

    cy.get('.item .details').contains('To be deleted').click();
    cy.get('.sliding-panel.visible .delete-link').click();
    cy.on('window:confirm', () => true);
    cy.contains('.item .details', 'To be deleted').should('not.exist');
  });

  describe('Category Integration', () => {
    beforeEach(() => {
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.add-category-row .live-edit-name').type('TestCategory');
      cy.get('.add-category-row .live-edit-icon').type('🧪');
      cy.get('.add-category-row .add-button').click();
      cy.get('.sliding-panel.visible .close-btn').click();
    });

    it('should show category selector when categories exist', () => {
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible .category-selector').should('be.visible');
      cy.get('.sliding-panel.visible .category-chip').should('have.length', 1);
      cy.get('.sliding-panel.visible .category-chip').should('contain.text', 'TestCategory');
    });

    it('should not show category selector when no categories exist', () => {
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.category-item .delete-btn').click();
      cy.on('window:confirm', () => true);
      cy.get('.sliding-panel.visible .close-btn').click();

      cy.get('.fab').click();
      cy.get('.sliding-panel.visible .category-selector').should('not.exist');
    });

    it('should add template with selected category', () => {
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Categorized template');
      cy.get('.sliding-panel.visible .category-chip').contains('TestCategory').click();
      cy.get('.sliding-panel.visible .category-chip').contains('TestCategory').should('have.class', 'selected');
      cy.get('.sliding-panel.visible button').contains('Add').click();
      cy.get('.item .details').should('contain.text', 'Categorized template');
    });

    it('should toggle category selection', () => {
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible .category-chip').contains('TestCategory').click();
      cy.get('.sliding-panel.visible .category-chip').contains('TestCategory').should('have.class', 'selected');
      cy.get('.sliding-panel.visible .category-chip').contains('TestCategory').click();
      cy.get('.sliding-panel.visible .category-chip').contains('TestCategory').should('not.have.class', 'selected');
    });

    it('should clear category selections when add panel is reopened', () => {
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible .category-chip').contains('TestCategory').click();
      cy.get('.sliding-panel.visible .category-chip').contains('TestCategory').should('have.class', 'selected');
      cy.get('.sliding-panel.visible button').contains('Cancel').click();
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible .category-chip').contains('TestCategory').should('not.have.class', 'selected');
    });

    it('should pre-select active category when adding from filtered view', () => {
      cy.get('.bottom-bar button').contains('🧪').click({ force: true });
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible .category-chip').contains('TestCategory').should('have.class', 'selected');
    });
  });
});
