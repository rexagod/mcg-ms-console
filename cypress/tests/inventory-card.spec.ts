import { DATA_FEDERATION_NAMESPACE, MINUTE } from '../constants/common';
import {
  DATA_SOURCE_INPUTS,
  Providers,
  secretInputs,
  SINGLE_BUCKET_POLICY,
  TEST_DATA_SOURCE,
} from '../constants/tests';
import { BPCommon } from '../views/bucket-policies';
import { app } from '../views/common';
import { DSCommon } from '../views/data-resource';
import { MCGMSCommon } from '../views/mcg-ms-common';

describe('admin dashboard - inventory card', () => {
  const PROCESSING_DS = 'e2e-processing-data-source';

  before(() => {
    cy.login();
    MCGMSCommon.visitMcgMsDashboard();
    app.waitForLoad();
    cy.get(`[data-test="data-source-gallery-item-text"] a`).should(
      'contain',
      '0 Data source'
    );

    // creating a ready state data source
    cy.log('creating a ready data source for the tests');
    MCGMSCommon.visitDataSourceListPage(true);
    DSCommon.navigateToCreatePage();
    app.waitForLoad();
    const { awsAccessKey, awsSecretKey, targetBucket } = DATA_SOURCE_INPUTS;
    const correctSecretCredentials: secretInputs = {
      accessKey: awsAccessKey,
      secretKey: awsSecretKey,
    };
    DSCommon.create(
      Providers.AWS,
      TEST_DATA_SOURCE,
      targetBucket,
      correctSecretCredentials
    );
    DSCommon.checkCreation(TEST_DATA_SOURCE, DATA_FEDERATION_NAMESPACE);
    cy.byTestID(`resource-status`).should('contain', 'Ready');
    cy.log(
      'ready state data source successfully created and can be used across tests'
    );
  });

  beforeEach(() => {
    MCGMSCommon.visitMcgMsDashboard();
    app.waitForLoad();
  });

  after(() => {
    cy.log(
      'deleting the ready state data source created at the beginning of the tests.'
    );
    MCGMSCommon.visitDataSourceListPage();
    DSCommon.deleteFromListPage(TEST_DATA_SOURCE);
    // to make sure no resource are hanging around
    DSCommon.deleteFromCmd(TEST_DATA_SOURCE, DATA_FEDERATION_NAMESPACE);
    cy.byTestID('resource-row', { timeout: 2 * MINUTE }).should('not.exist');
  });

  it('should check whether the inventory card is present or not', () => {
    cy.byTestID('inventory-card')
      .should('exist')
      .within(() => {
        cy.byTestID('bucket-policy-gallery-item').should('exist');
        cy.byTestID('data-source-gallery-item').should('exist');
        cy.byTestID('obc-gallery-item').should('exist');
      });
  });

  it('should display count of both ready and non ready state data source', () => {
    // This test validates whether we are showing the correct count of data source in the card.
    // Along with that, also verify that we are appropriate status icon when need.

    cy.log('verifying we have the ready state data source.');
    cy.get(`[data-test="data-source-gallery-item-text"] a`).should(
      'contain',
      '1 Data source'
    );

    cy.log(
      'verifying we are not showing the status icons for ready state data sources.'
    );
    cy.byTestID('data-source-gallery-item-processing').should('not.exist');
    cy.byTestID('data-source-gallery-item-error').should('not.exist');

    cy.log(
      'navigating to data source list page to create the second non ready state data source.'
    );
    MCGMSCommon.visitDataSourceListPage(true);
    DSCommon.navigateToCreatePage();
    app.waitForLoad();

    cy.log('creating a non ready data source for the test');
    const incorrectCredential: secretInputs = {
      accessKey: 'test-access-key',
      secretKey: 'test-secret-key',
    };
    DSCommon.create(
      Providers.AWS,
      PROCESSING_DS,
      'test-target-bucket',
      incorrectCredential
    );
    DSCommon.checkCreation(PROCESSING_DS, DATA_FEDERATION_NAMESPACE);
    cy.byTestID(`resource-status`).should('contain', 'Creating');
    DSCommon.navigateToDashboardViaBreadCrumbs(PROCESSING_DS);

    cy.log(
      'confirming both the ready and non ready state data sources count are present.'
    );
    cy.get(`[data-test="data-source-gallery-item-text"] a`).should(
      'contain',
      '2 Data source'
    );

    cy.log('confirming we are showing only the required status icons.');
    cy.byTestID('data-source-gallery-item-processing').should('be.visible');
    cy.byTestID('mcg-resource-popover').should('be.visible').click();
    cy.contains(PROCESSING_DS);
    cy.byTestID('data-source-gallery-item-error').should('not.exist');

    cy.log('deleting the non ready state data source created in this test');
    MCGMSCommon.visitDataSourceListPage();
    DSCommon.deleteFromListPage(PROCESSING_DS);
    DSCommon.deleteFromCmd(PROCESSING_DS, DATA_FEDERATION_NAMESPACE);
  });

  it('should route to data source list page on clicking the data source count', () => {
    cy.get(`[data-test="data-source-gallery-item-text"] a`)
      .should('contain', '1 Data source')
      .click();
    cy.location('pathname').should(
      'eq',
      `/mcgms/cluster/resource/noobaa.io~v1alpha1~NamespaceStore`
    );
  });

  it('should display the count of number of bucket policies and obc', () => {
    cy.get(`[data-test="bucket-policy-gallery-item-text"] a`).should(
      'contain',
      '1 Bucket policy'
    );
    cy.get(`[data-test="obc-gallery-item-text"] a`).should(
      'contain',
      '0 ObjectBucketClaims'
    );

    MCGMSCommon.visitBucketPolicyList();
    BPCommon.navigateToCreatePage();
    BPCommon.createSingle(SINGLE_BUCKET_POLICY, TEST_DATA_SOURCE);
    BPCommon.checkCreation(SINGLE_BUCKET_POLICY, TEST_DATA_SOURCE);
    BPCommon.navigateToDashboardViaBreadCrumbs(SINGLE_BUCKET_POLICY);

    cy.get(`[data-test="bucket-policy-gallery-item-text"] a`).should(
      'contain',
      '2 Bucket policies'
    );
    cy.get(`[data-test="obc-gallery-item-text"] a`).should(
      'contain',
      '1 ObjectBucketClaim'
    );
    cy.byTestID('bucket-policy-gallery-item-processing').should('not.exist');
    cy.byTestID('bucket-policy-gallery-item-error').should('not.exist');
    cy.byTestID('obc-gallery-item-processing').should('not.exist');
    cy.byTestID('obc-gallery-item-error').should('not.exist');

    cy.log('deleting the bucket policy during this test.');
    MCGMSCommon.visitMcgMsDashboard();
    MCGMSCommon.visitBucketPolicyList();
    BPCommon.deleteFromListPage(SINGLE_BUCKET_POLICY);
  });

  it('should route to bucket list page on clicking the bucket policy count', () => {
    cy.get(`[data-test="bucket-policy-gallery-item-text"] a`)
      .should('contain', '1 Bucket policy')
      .click();
    cy.location('pathname').should(
      'eq',
      `/mcgms/cluster/resource/noobaa.io~v1alpha1~BucketClass`
    );
  });

  it('should route to obc list page on clicking the obc count', () => {
    cy.get(`[data-test="obc-gallery-item-text"] a`)
      .should('contain', '0 ObjectBucketClaims')
      .click();
    cy.location('pathname').should(
      'eq',
      `/k8s/all-namespaces/objectbucket.io~v1alpha1~ObjectBucketClaim`
    );
  });
});
