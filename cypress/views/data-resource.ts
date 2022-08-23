import { MINUTE, SECOND } from '../constants/common';
import {
  dataSourceInputs,
  DATA_SOURCE_INPUTS,
  Providers,
  secretInputs,
} from '../constants/tests';

const inputCustomSecrets = ({ accessKey, secretKey }: secretInputs) => {
  cy.log('setting up custom secret for the resource');
  cy.byTestID('switch-to-credentials').click();
  cy.byTestID(`namespacestore-access-key`).type(accessKey);
  cy.byTestID(`namespacestore-secret-key`).type(secretKey);
};

const setUpProvider = (
  provider: Providers,
  targetBucket: string,
  customSecretFields: secretInputs = {},
  enterEndpoint: boolean = true
) => {
  cy.log(`setting up ${provider} provider for the data source`);
  cy.log('selecting the provider from the provider dropdown');
  cy.byTestID(`data-source-provider`).click();
  cy.byTestDropDownMenu(provider).click();
  switch (provider) {
    case Providers.AWS:
      cy.log('AWS provider is selected, selecting the region');
      cy.byTestID(`aws-region-dropdown`).click();
      cy.byTestDropDownMenu(DATA_SOURCE_INPUTS.awsRegion).click();
      break;
    case Providers.S3:
    case Providers.IBM:
      if (enterEndpoint) {
        const endpoint = 'http://test-endpoint.com';
        cy.byTestID(`namespacestore-s3-endpoint`).type(endpoint);
      }
      break;
    default:
      break;
  }
  // when we will need provider of type file system, put this inside switch
  inputCustomSecrets(customSecretFields);
  cy.byTestID(`namespacestore-target-bucket`).type(targetBucket);
};

const checkSecretCreation = (resourceName: string, namespace: string) => {
  cy.log('checking whether the new secret is created or not');
  cy.exec(`oc get secrets ${resourceName}-secret -n ${namespace}`, {
    failOnNonZeroExit: true,
    log: true,
    timeout: 2 * MINUTE,
  })
    .its('code')
    .should('eq', 0);
};

export const DSCommon = {
  navigateToCreatePage: () => {
    cy.log('navigating to data source create page to proceed with tests');
    cy.byTestID('item-create').click();
    cy.location('pathname').should(
      'eq',
      '/mcgms/resource/noobaa.io~v1alpha1~NamespaceStore/create/~new'
    );
  },
  navigateToListPageViaBreadCrumbs: (dataSourceName: string) => {
    cy.log('navigating to data source list page');
    cy.location('pathname').should(
      'eq',
      `/mcgms/resource/noobaa.io~v1alpha1~NamespaceStore/${dataSourceName}`
    );
    cy.byTestID('breadcrumb-link-1').click();
    cy.location('pathname').should(
      'eq',
      `/mcgms/cluster/resource/noobaa.io~v1alpha1~NamespaceStore`
    );
  },
  navigateToDashboardViaBreadCrumbs: (dataSourceName: string) => {
    cy.log('navigating to managed console dashboard');
    cy.location('pathname').should(
      'eq',
      `/mcgms/resource/noobaa.io~v1alpha1~NamespaceStore/${dataSourceName}`
    );
    cy.byTestID('breadcrumb-link-0').click();
    cy.location('pathname').should('eq', `/mcgms/cluster`);
  },
  create: (
    provider: Providers,
    dataSourceName: string,
    targetBucket: string,
    customSecretFields: secretInputs = {}
  ) => {
    cy.log(`creating data source with ${provider} as provider`);
    cy.log(`entering data source name as ${dataSourceName}`);
    cy.byTestID(`data-source-name`).type(dataSourceName);
    setUpProvider(provider, targetBucket, customSecretFields);
    cy.byTestID(`data-source-create-button`).click();
  },
  checkCreation: (
    resourceName: string,
    namespace: string,
    secretCheck: boolean = true
  ) => {
    cy.log('checking whether the data source is created or not');
    cy.byTestID('resource-title', { timeout: 20 * SECOND }).should(
      'contain',
      resourceName
    );
    if (secretCheck) {
      checkSecretCreation(resourceName, namespace);
    }
  },
  deleteFromDetailsPage: (dataSourceName: string) => {
    cy.log('deleting data sources using kebab menu from details page');
    cy.location('pathname').should(
      'eq',
      `/mcgms/resource/noobaa.io~v1alpha1~NamespaceStore/${dataSourceName}`
    );
    cy.byTestID('details-actions').click();
    cy.byTestDropDownMenu('delete-data-source').click();
    cy.byTestID('delete-action').click();
  },
  deleteFromCmd: (dataSourceName: string, namespace: string) => {
    cy.log(
      `deleting ${dataSourceName}-secret from ${namespace} namespace using execute command`
    );
    cy.exec(
      `oc delete secrets ${dataSourceName}-secret -n ${namespace} --wait`
    );
    cy.log(
      `deleting ${dataSourceName} from ${namespace} namespace using execute command`
    );
    cy.exec(
      `oc delete namespacestores ${dataSourceName} -n ${namespace} --wait`,
      { timeout: 5 * MINUTE, failOnNonZeroExit: false }
    );
  },
  deleteFromListPage: (name) => {
    cy.log(`deleting ${name} from the list page using kebab menu`);
    cy.byTestRows('resource-row')
      .should('contain', name)
      .byTestID(`${name}-kebab`)
      .click();
    cy.byTestDropDownMenu('delete-data-source').click();
    cy.byTestID('delete-action').click();
  },
  createFormInputValidation: (
    { name, provider, secretInfo = {}, targetBucket }: dataSourceInputs,
    enterEndpoint = true
  ) => {
    if (name) cy.byTestID(`data-source-name`).type(name);
    cy.byTestID(`data-source-provider`).click();
    cy.byTestDropDownMenu(provider).click();
    if (
      enterEndpoint &&
      (provider === Providers.S3 || provider === Providers.IBM)
    ) {
      cy.byTestID(`namespacestore-s3-endpoint`).type(
        'http://test-endpoint.com'
      );
    }
    cy.byTestID('switch-to-credentials').click();
    const { accessKey, secretKey } = secretInfo;
    if (accessKey) cy.byTestID(`namespacestore-access-key`).type(accessKey);
    if (secretKey) cy.byTestID(`namespacestore-secret-key`).type(secretKey);
    if (targetBucket)
      cy.byTestID(`namespacestore-target-bucket`).type(targetBucket);
    cy.byTestID(`data-source-create-button`).should('be.disabled');
  },
};
