export const pvc = {
  createPVC: (
    name: string,
    size: string,
    storageClass: string,
    checkBound = true,
    mode: 'Block' | 'Filesystem' = 'Filesystem'
  ) => {
    cy.byTestID('item-create').click();
    cy.byTestID('storageclass-dropdown').click();
    cy.get(`#${storageClass}-link`).click(); // eslint-disable-line cypress/require-data-selectors
    cy.byTestID('pvc-name').type(name);
    cy.byTestID('pvc-size').type(size);
    if (mode === 'Block') {
      cy.byTestID('Block-radio-input').click();
    }
    cy.byTestID('create-pvc').click();
    cy.byTestID('resource-status', { timeout: 10000 }).should('exist');
    if (checkBound) {
      cy.byTestID('resource-status').contains('Bound', { timeout: 50000 });
    }
  },
};
