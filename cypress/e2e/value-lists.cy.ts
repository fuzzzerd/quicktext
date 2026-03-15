describe('Value Lists', () => {
  beforeEach(() => {
    cy.clearAllStorage();
    cy.setStorageTypeAndWait('localStorage');
    cy.visit('/');
  });

  function openValueListManager() {
    cy.get('.icons button').contains('...').click();
    cy.get('.sliding-panel.visible ul li').contains('Manage Value Lists').click();
  }

  function addTemplate(text: string) {
    cy.get('.fab').click();
    cy.get('.sliding-panel.visible textarea[name="msgAdd"]').type(text, {
      parseSpecialCharSequences: false
    });
    cy.get('.sliding-panel.visible button').contains('Add').click();
  }

  function addValueToVariable(value: string) {
    cy.get('.sliding-panel.visible .values-section .add-value-row input').type(value);
    cy.get('.sliding-panel.visible .values-section .add-value-row .add-value-button').click();
  }

  describe('Variable Detection', () => {
    it('should show detected variables from templates', () => {
      addTemplate('Hello {{name}}, your status is {{status}}');
      openValueListManager();

      cy.get('.sliding-panel.visible .list-block').should('have.length', 2);
      cy.get('.sliding-panel.visible .variable-label').eq(0).should('contain.text', 'name');
      cy.get('.sliding-panel.visible .variable-label').eq(1).should('contain.text', 'status');
    });

    it('should show empty state when no templates have variables', () => {
      addTemplate('Simple text without variables');
      openValueListManager();

      cy.get('.sliding-panel.visible .empty-state').should('be.visible');
      cy.get('.sliding-panel.visible .empty-state').should('contain.text', 'No template variables detected');
    });

    it('should show empty state when no templates exist', () => {
      openValueListManager();

      cy.get('.sliding-panel.visible .empty-state').should('be.visible');
    });

    it('should deduplicate variables across templates', () => {
      addTemplate('Hello {{name}}');
      addTemplate('Goodbye {{name}}, status: {{status}}');
      openValueListManager();

      // Should show 2 unique variables, not 3
      cy.get('.sliding-panel.visible .list-block').should('have.length', 2);
    });

    it('should show "no options" for variables without values', () => {
      addTemplate('Status: {{status}}');
      openValueListManager();

      cy.get('.sliding-panel.visible .no-values').should('contain.text', 'no options');
    });
  });

  describe('Adding Values to Variables', () => {
    beforeEach(() => {
      addTemplate('Status: {{status}}, assigned to {{name}}');
      openValueListManager();
    });

    it('should expand a variable to add values', () => {
      cy.get('.sliding-panel.visible .list-block').first().click();
      cy.get('.sliding-panel.visible .values-section').should('be.visible');
      cy.get('.sliding-panel.visible .empty-values').should('contain.text', 'No options yet');
    });

    it('should add values to a variable', () => {
      // Click on status variable
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      addValueToVariable('Open');
      addValueToVariable('In Progress');
      addValueToVariable('Closed');

      cy.get('.sliding-panel.visible .value-item').should('have.length', 3);
    });

    it('should show count badge after adding values', () => {
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      addValueToVariable('Open');
      addValueToVariable('Closed');

      // Should show count badge
      cy.get('.sliding-panel.visible .list-block').first().find('.count-badge').should('contain.text', '2');
    });

    it('should persist values across panel close/reopen', () => {
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      addValueToVariable('Open');
      addValueToVariable('Closed');

      // Close and reopen
      cy.get('.sliding-panel.visible .close-btn').click();
      openValueListManager();

      // Should show count badge
      cy.get('.sliding-panel.visible .list-block').first().find('.count-badge').should('contain.text', '2');

      // Expand and verify values
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      cy.get('.sliding-panel.visible .values-section').should('exist');
      cy.get('.sliding-panel.visible .value-item').should('have.length', 2);
      cy.get('.sliding-panel.visible .value-item').eq(0).find('.live-edit-value').should('have.value', 'Open');
      cy.get('.sliding-panel.visible .value-item').eq(1).find('.live-edit-value').should('have.value', 'Closed');
    });

    it('should edit a value', () => {
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      addValueToVariable('Open');

      cy.get('.sliding-panel.visible .value-item .live-edit-value').clear().type('Active');
      cy.get('.sliding-panel.visible .value-item .live-edit-value').should('have.value', 'Active');
    });

    it('should delete a value', () => {
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      addValueToVariable('Open');
      addValueToVariable('Closed');

      cy.get('.sliding-panel.visible .value-item').should('have.length', 2);
      cy.get('.sliding-panel.visible .value-item').first().find('.delete-value-btn').click();
      cy.get('.sliding-panel.visible .value-item').should('have.length', 1);
    });

    it('should have drag handles on values', () => {
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      addValueToVariable('Open');
      addValueToVariable('Closed');

      cy.get('.sliding-panel.visible .value-item .value-handle').should('have.length', 2);
      cy.get('.sliding-panel.visible .value-item').each(($item) => {
        cy.wrap($item).should('have.attr', 'draggable', 'true');
      });
    });
  });

  describe('Expand/Collapse', () => {
    it('should toggle expansion of a variable', () => {
      addTemplate('Status: {{status}}');
      openValueListManager();

      // Click to expand
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      cy.get('.sliding-panel.visible .values-section').should('be.visible');

      // Click again to collapse
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      cy.get('.values-section').should('not.exist');

      // Click again to expand
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      cy.get('.sliding-panel.visible .values-section').should('be.visible');
    });
  });

  describe('Combobox Integration with Template Variables', () => {
    beforeEach(() => {
      // Create template and add values for "status"
      addTemplate('Status: {{status}}');
      openValueListManager();
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      addValueToVariable('Open');
      addValueToVariable('In Progress');
      addValueToVariable('Closed');
      cy.get('.sliding-panel.visible .close-btn').click();
    });

    it('should show combobox for variable with values', () => {
      cy.get('.item .icons button').contains('📃').click();

      cy.get('.combobox').should('exist');
      cy.get('.combobox-toggle').should('exist');
    });

    it('should show regular input for variable without values', () => {
      // Add template with unmatched variable
      addTemplate('Name: {{name}}');

      cy.get('.item').last().find('.icons button').contains('📃').click();

      cy.get('.combobox').should('not.exist');
      cy.get('.variable-input input').should('exist');
    });

    it('should show dropdown options when combobox toggle is clicked', () => {
      cy.get('.item .icons button').contains('📃').click();

      cy.get('.combobox-toggle').click();

      cy.get('.combobox-dropdown').should('be.visible');
      cy.get('.combobox-option').should('have.length', 3);
      cy.get('.combobox-option').eq(0).should('contain.text', 'Open');
      cy.get('.combobox-option').eq(1).should('contain.text', 'In Progress');
      cy.get('.combobox-option').eq(2).should('contain.text', 'Closed');
    });

    it('should select value from dropdown', () => {
      cy.get('.item .icons button').contains('📃').click();

      cy.get('.combobox-toggle').click();
      cy.get('.combobox-option').contains('In Progress').click();

      cy.get('.combobox-input').should('have.value', 'In Progress');
    });

    it('should allow typing custom value in combobox', () => {
      cy.get('.item .icons button').contains('📃').click();

      cy.get('.combobox-input').type('Custom Status');
      cy.get('.combobox-input').should('have.value', 'Custom Status');
    });

    it('should filter dropdown options while typing', () => {
      cy.get('.item .icons button').contains('📃').click();

      cy.get('.combobox-input').type('Cl');

      cy.get('.combobox-option').should('have.length', 1);
      cy.get('.combobox-option').should('contain.text', 'Closed');
    });

    it('should match value list case-insensitively', () => {
      // Add template with different casing
      addTemplate('Status: {{Status}}');

      cy.get('.item').last().find('.icons button').contains('📃').click();

      cy.get('.combobox').should('exist');
      cy.get('.combobox-toggle').click();
      cy.get('.combobox-option').should('have.length', 3);
    });

    it('should show mixed inputs for template with matched and unmatched variables', () => {
      addTemplate('{{name}} set {{status}}');

      cy.get('.item').last().find('.icons button').contains('📃').click();

      cy.get('.variable-input').should('have.length', 2);

      // "name" should be regular input
      cy.get('.variable-input').eq(0).find('.combobox').should('not.exist');
      cy.get('.variable-input').eq(0).find('input[type="text"]').should('exist');

      // "status" should be combobox
      cy.get('.variable-input').eq(1).find('.combobox').should('exist');
    });
  });

  describe('Graceful Fallback on Value List Deletion', () => {
    it('should fall back to free text when all values are removed', () => {
      addTemplate('Status: {{status}}');

      // Add values
      openValueListManager();
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      addValueToVariable('Open');
      cy.get('.sliding-panel.visible .close-btn').click();

      // Verify combobox shows
      cy.get('.item .icons button').contains('📃').click();
      cy.get('.combobox').should('exist');
      cy.get('.template-form button').contains('Cancel').click();

      // Remove all values (which removes the value list)
      openValueListManager();
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      cy.get('.sliding-panel.visible .values-section').should('exist');
      cy.get('.sliding-panel.visible .value-item .delete-value-btn').click();
      cy.get('.sliding-panel.visible .close-btn').click();

      // Should now be regular input
      cy.get('.item .icons button').contains('📃').click();
      cy.get('.combobox').should('not.exist');
      cy.get('.variable-input input[type="text"]').should('exist');
    });
  });

  describe('Variable Detection in Edit Panel', () => {
    it('should show detected variables when editing a template', () => {
      addTemplate('Hello {{name}}, status: {{status}}');

      cy.get('.item .details').click();

      cy.get('.variable-status-list').should('be.visible');
      cy.get('.variable-status-item').should('have.length', 2);
      cy.get('.variable-name').eq(0).should('contain.text', 'name');
      cy.get('.variable-name').eq(1).should('contain.text', 'status');
    });

    it('should show linked status for variables with value lists', () => {
      addTemplate('Hello {{name}}, status: {{status}}');

      // Add values for status
      openValueListManager();
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      addValueToVariable('Open');
      addValueToVariable('Closed');
      cy.get('.sliding-panel.visible .close-btn').click();

      // Edit the template
      cy.get('.item .details').click();

      // "name" should show "free text"
      cy.get('.variable-status-item').eq(0).find('.variable-freetext').should('contain.text', 'free text');

      // "status" should show "2 options"
      cy.get('.variable-status-item').eq(1).find('.variable-linked').should('contain.text', '2 options');
    });
  });

  describe('Persistence', () => {
    it('should persist value lists across page reloads', () => {
      addTemplate('Status: {{status}}');

      // Add values
      openValueListManager();
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      addValueToVariable('Open');
      addValueToVariable('Closed');
      cy.get('.sliding-panel.visible .close-btn').click();

      // Reload
      cy.reload();

      // Verify value list persisted
      openValueListManager();
      cy.get('.sliding-panel.visible .list-block').should('have.length', 1);
      cy.get('.sliding-panel.visible .count-badge').should('contain.text', '2');

      // Expand and check values
      cy.get('.sliding-panel.visible .variable-label').contains('status').click();
      cy.get('.sliding-panel.visible .value-item').should('have.length', 2);
      cy.get('.sliding-panel.visible .value-item').eq(0).find('.live-edit-value').should('have.value', 'Open');
      cy.get('.sliding-panel.visible .value-item').eq(1).find('.live-edit-value').should('have.value', 'Closed');
    });
  });
});
