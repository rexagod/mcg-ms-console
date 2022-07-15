import { STATUS_CARD_TITLE } from '../constants/common';
import { MCG_MS_Common } from '../views/mcg-ms-common';

describe('admin dashboard - status card', () => {
  before(() => {
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  beforeEach(() => {
    MCG_MS_Common.visitMcgMsDashboard();
  });

  it('status should be healthy and not contain health state message', () => {
    cy.log(
      'check whether the operator status is healthy based on success icon'
    );
    cy.get(`[data-test="mcgms-health-item-icon"] [data-test="success-icon"]`)
      .should('exist')
      .get('title')
      .contains('Healthy');
    cy.log(
      'making sure we are not showing healthy operator status health in text'
    );
    cy.byStatusID(`${STATUS_CARD_TITLE}-secondary-status`).should('not.exist');
  });
});
