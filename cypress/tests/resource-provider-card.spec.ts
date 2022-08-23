import { DATA_FEDERATION_NAMESPACE, MINUTE } from '../constants/common';
import {
  PVC_NAME,
  DATA_SOURCE_NAME_NSFS,
  DATA_SOURCE_NAME_AWS,
} from '../constants/tests';
import { dataSourceAWS, dataSourceNSFS } from '../mocks/data-source';
import { app } from '../views/common';
import { MCGMSCommon } from '../views/mcg-ms-common';

describe('admin dashboard - resource provider card', () => {
  before(() => {
    cy.login();
    cy.exec(`oc delete --all namespacestores -n ${DATA_FEDERATION_NAMESPACE}`, {
      failOnNonZeroExit: false,
    }).then(() => {
      cy.exec(`oc delete pvc ${PVC_NAME} -n ${DATA_FEDERATION_NAMESPACE}`, {
        timeout: 3 * MINUTE,
        failOnNonZeroExit: false,
      });
    });
  });

  beforeEach(() => {
    MCGMSCommon.visitMcgMsDashboard();
    app.waitForLoad();
  });

  after(() => {
    cy.exec(`oc delete --all namespacestores -n ${DATA_FEDERATION_NAMESPACE}`, {
      failOnNonZeroExit: false,
    }).then(() => {
      cy.exec(`oc delete pvc ${PVC_NAME} -n ${DATA_FEDERATION_NAMESPACE}`, {
        timeout: 3 * MINUTE,
        failOnNonZeroExit: false,
      });
    });
    cy.logout();
  });

  it('should check if resource provider card is present', () => {
    cy.byTestID('resource-provider-card')
      .should('exist')
      .contains('Resource Providers');
  });

  it('should display not available when we do not have any data source in ready state', () => {
    cy.exec(
      `echo '${JSON.stringify(
        dataSourceAWS(DATA_SOURCE_NAME_AWS)
      )}' | oc create -f -`
    ).then(() => {
      cy.byTestID('resource-providers-not-available').contains('Not available');
    });
  });

  it('should display the count of providers of data source which are in ready state', () => {
    cy.exec(
      `echo '${JSON.stringify(
        dataSourceNSFS(DATA_SOURCE_NAME_NSFS, PVC_NAME, 'e2e-subPath')
      )}' | oc create -f -`
    ).then(() => {
      cy.byTestID('nb-resource-providers-card').contains('1 Filesystem');
    });
  });
});
