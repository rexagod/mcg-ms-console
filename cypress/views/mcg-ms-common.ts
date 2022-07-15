import { DATA_FEDERATION, DATA_SERVICES } from '../constants/common';

export const MCGMSCommon = {
  visitMCGMSDashboard: () => {
    cy.log(
      'navigating to mcg-ms-console operator from the side navigation bar'
    );
    cy.clickNavLink([DATA_SERVICES, DATA_FEDERATION]);
    cy.log('making sure we are routed to proper endpoint');
    cy.location('pathname').should('eq', '/mcgms/cluster');
  },
  visitBucketPolicyList: () => {
    cy.clickNavLink([DATA_SERVICES, DATA_FEDERATION]);
    cy.byLegacyTestID('horizontal-link-Buckets').click();
  },
};
