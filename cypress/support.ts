/* eslint-disable cypress/require-data-selectors */
import './support/login';
import './support/selectors';
/* import all support files above */

Cypress.on('uncaught:exception', () => {
  // don't fail on Cypress' internal errors.
  return false;
});

Cypress.Cookies.debug(true);

Cypress.Cookies.defaults({
  preserve: ['openshift-session-token', 'csrf-token'],
});
