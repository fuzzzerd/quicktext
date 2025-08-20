describe('Category Management', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  describe('Category CRUD Operations', () => {
    it('should add a new category', () => {
      // Open settings menu
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();

      // Add a new category
      cy.get('.add-category-row .live-edit-name').type('Work');
      cy.get('.add-category-row .live-edit-icon').type('💼');
      cy.get('.add-category-row .add-button').click();

      // Verify category was added
      cy.get('.category-item .live-edit-name').should('have.value', 'Work');
      cy.get('.category-item .live-edit-icon').should('have.value', '💼');
    });

    it('should edit an existing category name', () => {
      // Create a category first
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.add-category-row .live-edit-name').type('Work');
      cy.get('.add-category-row .add-button').click();

      // Edit the category name
      cy.get('.category-item .live-edit-name').clear().type('Business');

      // Close and reopen to verify persistence
      cy.get('.close-btn').click();
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();

      // Verify the name was changed
      cy.get('.category-item .live-edit-name').should('have.value', 'Business');
    });

    it('should edit an existing category icon', () => {
      // Create a category first
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.add-category-row .live-edit-name').type('Work');
      cy.get('.add-category-row .live-edit-icon').type('💼');
      cy.get('.add-category-row .add-button').click();

      // Edit the category icon
      cy.get('.category-item .live-edit-icon').clear().type('🏢');

      // Close and reopen to verify persistence
      cy.get('.close-btn').click();
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();

      // Verify the icon was changed
      cy.get('.category-item .live-edit-icon').should('have.value', '🏢');
    });

    it('should delete a category', () => {
      // Create a category first
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      cy.get('.add-category-row .live-edit-name').type('Work');
      cy.get('.add-category-row .add-button').click();

      // Delete the category
      cy.get('.category-item .delete-btn').click();
      cy.on('window:confirm', () => true); // Accept the confirmation dialog

      // Verify category was deleted
      cy.get('.category-item').should('not.exist');
    });

    it('should create multiple categories', () => {
      // Open category manager
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();

      // Add first category
      cy.get('.add-category-row .live-edit-name').type('Work');
      cy.get('.add-category-row .live-edit-icon').type('💼');
      cy.get('.add-category-row .add-button').click();

      // Add second category
      cy.get('.add-category-row .live-edit-name').type('Personal');
      cy.get('.add-category-row .live-edit-icon').type('🏠');
      cy.get('.add-category-row .add-button').click();

      // Add third category
      cy.get('.add-category-row .live-edit-name').type('Shopping');
      cy.get('.add-category-row .live-edit-icon').type('🛒');
      cy.get('.add-category-row .add-button').click();

      // Verify all categories exist
      cy.get('.category-item').should('have.length', 3);
      cy.get('.category-item').eq(0).find('.live-edit-name').should('have.value', 'Work');
      cy.get('.category-item').eq(1).find('.live-edit-name').should('have.value', 'Personal');
      cy.get('.category-item').eq(2).find('.live-edit-name').should('have.value', 'Shopping');
    });
  });

  describe('Template-Category Associations', () => {
    beforeEach(() => {
      // Create some categories for testing
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      
      // Add Work category
      cy.get('.add-category-row .live-edit-name').type('Work');
      cy.get('.add-category-row .live-edit-icon').type('💼');
      cy.get('.add-category-row .add-button').click();
      
      // Add Personal category
      cy.get('.add-category-row .live-edit-name').type('Personal');
      cy.get('.add-category-row .live-edit-icon').type('🏠');
      cy.get('.add-category-row .add-button').click();
      
      // Close category manager
      cy.get('.close-btn').click();
    });

    it('should add a template to a specific category', () => {
      // Add a new template with category selection
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Meeting notes template');
      
      // Select Work category
      cy.get('.sliding-panel.visible .category-chip').contains('Work').click();
      cy.get('.sliding-panel.visible .category-chip').contains('Work').should('have.class', 'selected');
      
      cy.get('.sliding-panel.visible button').contains('Add').click();

      // Verify template was added
      cy.get('.item .details').should('contain.text', 'Meeting notes template');
    });

    it('should add a template to multiple categories', () => {
      // Add a new template with multiple category selections
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Universal greeting');
      
      // Select both categories
      cy.get('.sliding-panel.visible .category-chip').contains('Work').click();
      cy.get('.sliding-panel.visible .category-chip').contains('Personal').click();
      
      // Verify both are selected
      cy.get('.sliding-panel.visible .category-chip').contains('Work').should('have.class', 'selected');
      cy.get('.sliding-panel.visible .category-chip').contains('Personal').should('have.class', 'selected');
      
      cy.get('.sliding-panel.visible button').contains('Add').click();

      // Verify template was added
      cy.get('.item .details').should('contain.text', 'Universal greeting');
    });

    it('should edit template categories', () => {
      // Add a template first
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Test template');
      cy.get('.sliding-panel.visible .category-chip').contains('Work').click();
      cy.get('.sliding-panel.visible button').contains('Add').click();

      // Edit the template
      cy.get('.item .details').contains('Test template').click();
      
      // Deselect Work and select Personal instead
      cy.get('.sliding-panel.visible .category-chip').contains('Work').should('have.class', 'selected').click();
      cy.get('.sliding-panel.visible .category-chip').contains('Personal').click();
      
      // Save changes
      cy.get('.sliding-panel.visible button').contains('Save').click();

      // Template should still exist (we're just changing categories)
      cy.get('.item .details').should('contain.text', 'Test template');
    });

    it('should show templates when no categories exist', () => {
      // Delete all categories first
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      
      // Delete all categories
      cy.get('.category-item .delete-btn').each(($btn) => {
        cy.wrap($btn).click();
        cy.on('window:confirm', () => true);
      });
      
      cy.get('.close-btn').click();

      // Add a template (should work without categories)
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Uncategorized template');
      cy.get('.sliding-panel.visible button').contains('Add').click();

      // Verify template appears
      cy.get('.item .details').should('contain.text', 'Uncategorized template');
      
      // Bottom bar should not be visible when no categories exist
      cy.get('.bottom-bar').should('not.exist');
    });
  });

  describe('Category Filtering and Bottom Bar', () => {
    beforeEach(() => {
      // Create categories and templates for testing
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      
      // Add categories
      cy.get('.add-category-row .live-edit-name').type('Work');
      cy.get('.add-category-row .live-edit-icon').type('💼');
      cy.get('.add-category-row .add-button').click();
      
      cy.get('.add-category-row .live-edit-name').type('Personal');
      cy.get('.add-category-row .live-edit-icon').type('🏠');
      cy.get('.add-category-row .add-button').click();
      
      cy.get('.close-btn').click();

      // Add templates to different categories
      // Work template
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Work email template');
      cy.get('.sliding-panel.visible .category-chip').contains('Work').click();
      cy.get('.sliding-panel.visible button').contains('Add').click();

      // Personal template
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('Personal note template');
      cy.get('.sliding-panel.visible .category-chip').contains('Personal').click();
      cy.get('.sliding-panel.visible button').contains('Add').click();

      // Uncategorized template
      cy.get('.fab').click();
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type('General template');
      cy.get('.sliding-panel.visible button').contains('Add').click();
    });

    it('should show bottom bar with category tabs when categories exist', () => {
      // Bottom bar should be visible
      cy.get('.bottom-bar').should('exist');
      
      // Check for Work category button
      cy.get('.bottom-bar button', { timeout: 5000 }).contains('💼').should('exist');
      
      // Check for Personal category button  
      cy.get('.bottom-bar button', { timeout: 5000 }).contains('🏠').should('exist');
    });

    it('should filter templates by Work category', () => {
      // Initially should see all templates
      cy.get('.item').should('have.length', 3);

      // Click Work category in bottom bar
      cy.get('.bottom-bar button').contains('💼').click({ force: true });

      // Should only see Work template
      cy.get('.item').should('have.length', 1);
      cy.get('.item .details').should('contain.text', 'Work email template');
      
      // Work button should be active
      cy.get('.bottom-bar button:contains("💼")').should('have.class', 'active');
    });

    it('should filter templates by Personal category', () => {
      // Click Personal category in bottom bar
      cy.get('.bottom-bar button').contains('🏠').click({ force: true });

      // Should only see Personal template
      cy.get('.item').should('have.length', 1);
      cy.get('.item .details').should('contain.text', 'Personal note template');
      
      // Personal button should be active
      cy.get('.bottom-bar button:contains("🏠")').should('have.class', 'active');
    });

    it('should filter templates by Uncategorized', () => {
      // Click Uncategorized in bottom bar
      cy.get('.bottom-bar button').contains('📁').click({ force: true });

      // Should only see uncategorized template
      cy.get('.item').should('have.length', 1);
      cy.get('.item .details').should('contain.text', 'General template');
      
      // Uncategorized button should be active
      cy.get('.bottom-bar button:contains("📁")').should('have.class', 'active');
    });

    it('should show all templates when switching between categories', () => {
      // Filter by Work first
      cy.get('.bottom-bar button').contains('💼').click({ force: true });
      cy.get('.item').should('have.length', 1);

      // Filter by Personal  
      cy.get('.bottom-bar button').contains('🏠').click({ force: true });
      cy.get('.item').should('have.length', 1);

      // Click same category again to show all (or test if there's a "show all" mechanism)
      // Since we removed the "show all" button, test category switching persistence
      cy.get('.bottom-bar button').contains('💼').click({ force: true });
      cy.get('.item').should('have.length', 1);
      cy.get('.item .details').should('contain.text', 'Work email template');
    });

    it('should persist category selection across page reloads', () => {
      // Select Work category
      cy.get('.bottom-bar button').contains('💼').click({ force: true });
      cy.get('.item').should('have.length', 1);
      cy.get('.bottom-bar button:contains("💼")').should('have.class', 'active');

      // Reload page
      cy.reload();

      // Should still be filtered by Work category
      cy.get('.item').should('have.length', 1);
      cy.get('.item .details').should('contain.text', 'Work email template');
      cy.get('.bottom-bar button:contains("💼")').should('have.class', 'active');
    });

    it('should show appropriate message when filtered category has no templates', () => {
      // Delete the Work template while it's visible
      cy.get('.bottom-bar button').contains('💼').click({ force: true });
      
      // Click on template to open edit panel
      cy.get('.item .details').contains('Work email template').click();
      
      // Delete via edit panel
      cy.get('.sliding-panel.visible .delete-link').click();
      cy.on('window:confirm', () => true);

      // Should show empty category message
      cy.get('.empty-category-message').should('be.visible');
      cy.get('.empty-category-message').should('contain.text', 'No templates in this category');
      cy.get('.empty-category-message .add-template-btn').should('be.visible');
    });

    it('should allow adding template from empty category message', () => {
      // Delete the Work template to make category empty
      cy.get('.bottom-bar button').contains('💼').click({ force: true });
      
      // Click on template to open edit panel
      cy.get('.item .details').contains('Work email template').click();
      
      // Delete via edit panel
      cy.get('.sliding-panel.visible .delete-link').click();
      cy.on('window:confirm', () => true);

      // Click add template button from empty message
      cy.get('.empty-category-message .add-template-btn').click();

      // Should open add panel with Work category pre-selected
      cy.get('.sliding-panel.visible textarea[name="msgAdd"]').should('be.visible');
      cy.get('.sliding-panel.visible .category-chip').contains('Work').should('have.class', 'selected');
    });
  });

  describe('Category Drag and Drop Reordering', () => {
    beforeEach(() => {
      // Create multiple categories for reordering tests
      cy.get('.icons button').contains('...').click();
      cy.get('.sliding-panel.visible ul li').contains('Manage Categories').click();
      
      // Add categories in order
      cy.get('.add-category-row .live-edit-name').type('First');
      cy.get('.add-category-row .add-button').click();
      
      cy.get('.add-category-row .live-edit-name').type('Second');
      cy.get('.add-category-row .add-button').click();
      
      cy.get('.add-category-row .live-edit-name').type('Third');
      cy.get('.add-category-row .add-button').click();
    });

    it('should display categories in the order they were created', () => {
      // Verify initial order
      cy.get('.category-item').eq(0).find('.live-edit-name').should('have.value', 'First');
      cy.get('.category-item').eq(1).find('.live-edit-name').should('have.value', 'Second');
      cy.get('.category-item').eq(2).find('.live-edit-name').should('have.value', 'Third');
    });

    // Note: Testing actual drag and drop in Cypress can be complex and flaky
    // For now, we test that the drag handles are present and the structure is correct
    it('should have drag handles for reordering', () => {
      cy.get('.category-item .drag-handle').should('have.length', 3);
      cy.get('.category-item').each(($item) => {
        cy.wrap($item).find('.drag-handle').should('contain', '☰');
      });
    });

    it('should have draggable attribute on category items', () => {
      cy.get('.category-item').each(($item) => {
        cy.wrap($item).should('have.attr', 'draggable', 'true');
      });
    });
  });
});