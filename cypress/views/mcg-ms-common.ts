import { DATA_FEDERATION, DATA_SERVICES } from '../constants/common';

export const MCG_MS_Common = {
  visitMcgMsDashboard: () => {
    cy.log('navigating to mcgms-console operator from the side navigation bar');
    cy.clickNavLink([DATA_SERVICES, DATA_FEDERATION]);
    cy.log('making sure we are routed to proper endpoint');
    cy.location('pathname').should('eq', '/mcgms/cluster');
  },
};
