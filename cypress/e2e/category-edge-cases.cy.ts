describe('Category Edge Cases and Integration', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  describe('Category Deletion Impact', () => {
    beforeEach(() => {
      // Setup: Create category and add template to it
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.add-category-row .live-edit-name').type('ToDelete');
      cy.get('.add-category-row .live-edit-icon').type('🗑️');
      cy.get('.add-category-row .add-button').click();
      cy.get('.close-btn').click();

      // Add a template to this category
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Template in category to be deleted');
      cy.get('.sliding-panel.visible .category-chip').contains('ToDelete').click();
      cy.get('.sliding-panel.visible button').contains('Add').click();
    });

    it('should move templates to uncategorized when their category is deleted', () => {
      // Verify template is initially categorized
      cy.get('.bottom-bar button').contains('🗑️').click({ force: true });
      cy.get('.item').should('have.length', 1);
      cy.get('.item .details').should('contain.text', 'Template in category to be deleted');

      // Delete the category
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.category-item .delete-btn').click();
      cy.on('window:confirm', () => true);
      cy.get('.close-btn').click();

      // Template should still exist but be uncategorized
      cy.get('.item .details').should('contain.text', 'Template in category to be deleted');
      
      // Bottom bar should no longer exist (no categories)
      cy.get('.bottom-bar').should('not.exist');
    });

    it('should remove category from multi-category templates when deleted', () => {
      // Create another category
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.add-category-row .live-edit-name').type('KeepThis');
      cy.get('.add-category-row .live-edit-icon').type('✅');
      cy.get('.add-category-row .add-button').click();
      cy.get('.close-btn').click();

      // Add a template to both categories
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Multi-category template');
      cy.get('.sliding-panel.visible .category-chip').contains('ToDelete').click();
      cy.get('.sliding-panel.visible .category-chip').contains('KeepThis').click();
      cy.get('.sliding-panel.visible button').contains('Add').click();

      // Verify template appears in both categories
      cy.get('.bottom-bar button').contains('🗑️').click({ force: true });
      cy.get('.item').should('have.length', 2); // Both templates
      
      cy.get('.bottom-bar button').contains('✅').click({ force: true });
      cy.get('.item').should('have.length', 1);
      cy.get('.item .details').should('contain.text', 'Multi-category template');

      // Delete the ToDelete category
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.category-item .live-edit-name[value="ToDelete"]').closest('.category-item').find('.delete-btn').click();
      cy.on('window:confirm', () => true);
      cy.get('.close-btn').click();

      // Template should still appear in KeepThis category
      cy.get('.bottom-bar button').contains('✅').click({ force: true });
      cy.get('.item').should('have.length', 1);
      cy.get('.item .details').should('contain.text', 'Multi-category template');
    });
  });

  describe('Category Name and Icon Validation', () => {
    beforeEach(() => {
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
    });

    it('should not add category with empty name', () => {
      // Try to add category with only icon
      cy.get('.add-category-row .live-edit-icon').type('📝');
      
      // Add button should be disabled
      cy.get('.add-category-row .add-button').should('be.disabled');
      
      // Force click the disabled button to test the function still doesn't add
      cy.get('.add-category-row .add-button').click({ force: true });

      // Category should not be added
      cy.get('.category-item').should('not.exist');
    });

    it('should add category with name only (no icon)', () => {
      // Add category with just name
      cy.get('.add-category-row .live-edit-name').type('No Icon Category');
      cy.get('.add-category-row .add-button').click();

      // Category should be added
      cy.get('.category-item .live-edit-name').should('have.value', 'No Icon Category');
      cy.get('.category-item .live-edit-icon').should('have.value', '');
    });

    it('should handle special characters in category names', () => {
      // Add category with special characters
      cy.get('.add-category-row .live-edit-name').type('Work & Personal (2024)');
      cy.get('.add-category-row .live-edit-icon').type('🔀');
      cy.get('.add-category-row .add-button').click();

      // Category should be added with special characters preserved
      cy.get('.category-item .live-edit-name').should('have.value', 'Work & Personal (2024)');
    });

    it('should handle emoji sequences in icons', () => {
      // Add category with complex emoji
      cy.get('.add-category-row .live-edit-name').type('Family');
      cy.get('.add-category-row .live-edit-icon').type('👨‍👩‍👧‍👦');
      cy.get('.add-category-row .add-button').click();

      // Category should be added with emoji preserved
      cy.get('.category-item .live-edit-icon').should('have.value', '👨‍👩‍👧‍👦');
    });
  });

  describe('Category Persistence and Local Storage', () => {
    it('should persist categories across page reloads', () => {
      // Create a category
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.add-category-row .live-edit-name').type('Persistent');
      cy.get('.add-category-row .live-edit-icon').type('💾');
      cy.get('.add-category-row .add-button').click();
      cy.get('.close-btn').click();

      // Reload page
      cy.reload();

      // Category should still exist
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.category-item .live-edit-name').should('have.value', 'Persistent');
      cy.get('.category-item .live-edit-icon').should('have.value', '💾');
    });
  });

  describe('Category Display Edge Cases', () => {
    it('should handle very long category names gracefully', () => {
      const longName = 'This is a very long category name that might cause display issues if not handled properly';
      
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.add-category-row .live-edit-name').type(longName);
      cy.get('.add-category-row .add-button').click();

      // Category should be added and visible in manager
      cy.get('.category-item .live-edit-name').should('have.value', longName);
      
      cy.get('.close-btn').click();

      // Should appear in bottom bar (might be truncated but should be functional)
      cy.get('.bottom-bar button').should('exist');
    });

    it('should handle many categories in bottom bar', () => {
      // Create 10 categories
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      
      for (let i = 1; i <= 10; i++) {
        cy.get('.add-category-row .live-edit-name').clear().type(`Cat${i}`);
        cy.get('.add-category-row .live-edit-icon').clear().type(`${i}️⃣`);
        cy.get('.add-category-row .add-button').click();
      }
      
      cy.get('.close-btn').click();

      // All categories should appear in bottom bar
      cy.get('.bottom-bar button').should('have.length', 10);
      
      // Bottom bar should be scrollable/responsive
      cy.get('.bottom-bar').should('exist');
    });

    it('should show welcome content when no templates exist but categories do', () => {
      // Create a category but no templates
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.add-category-row .live-edit-name').type('Empty');
      cy.get('.add-category-row .add-button').click();
      cy.get('.close-btn').click();

      // Should show welcome content in main area
      cy.get('main .welcome-container').should('be.visible');
      
      // But bottom bar should be visible
      cy.get('.bottom-bar').should('exist');
    });
  });

  describe('Template Editing with Categories', () => {
    beforeEach(() => {
      // Setup multiple categories and templates
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      
      cy.get('.add-category-row .live-edit-name').type('Work');
      cy.get('.add-category-row .live-edit-icon').type('💼');
      cy.get('.add-category-row .add-button').click();
      
      cy.get('.add-category-row .live-edit-name').type('Personal');
      cy.get('.add-category-row .live-edit-icon').type('🏠');
      cy.get('.add-category-row .add-button').click();
      
      cy.get('.close-btn').click();

      // Add a template
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Original template');
      cy.get('.sliding-panel.visible .category-chip').contains('Work').click();
      cy.get('.sliding-panel.visible button').contains('Add').click();
    });

    it('should preserve categories when editing template text only', () => {
      // Edit the template text
      cy.get('.item .details').contains('Original template').click();
      cy.get('.sliding-panel.visible textarea').clear().type('Modified template text');
      cy.get('.sliding-panel.visible button').contains('Save').click();

      // Should still be in Work category
      cy.get('.bottom-bar button').contains('💼').click({ force: true });
      cy.get('.item').should('have.length', 1);
      cy.get('.item .details').should('contain.text', 'Modified template text');
    });

    it('should update categories when changed during edit', () => {
      // Edit template and change category
      cy.get('.item .details').contains('Original template').click();
      
      // Deselect Work, select Personal
      cy.get('.sliding-panel.visible .category-chip').contains('Work').should('have.class', 'selected').click();
      cy.get('.sliding-panel.visible .category-chip').contains('Personal').click();
      
      cy.get('.sliding-panel.visible button').contains('Save').click();

      // Should now be in Personal category only
      cy.get('.bottom-bar button').contains('🏠').click({ force: true });
      cy.get('.item').should('have.length', 1);
      cy.get('.item .details').should('contain.text', 'Original template');

      // Should not be in Work category
      cy.get('.bottom-bar button').contains('💼').click({ force: true });
      cy.get('.item').should('have.length', 0);
    });

    it('should handle removing all categories from template', () => {
      // Edit template and remove all categories
      cy.get('.item .details').contains('Original template').click();
      cy.get('.sliding-panel.visible .category-chip').contains('Work').should('have.class', 'selected').click();
      cy.get('.sliding-panel.visible button').contains('Save').click();

      // Template should become uncategorized
      cy.get('.item .details').should('contain.text', 'Original template');
      
      // Should not appear in Work category
      cy.get('.bottom-bar button').contains('💼').click({ force: true });
      cy.get('.item').should('have.length', 0);
    });
  });
});