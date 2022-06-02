#!/usr/bin/env bash

# -e: Exit immediately if a pipeline, a list, or a compound command, exits with a non-zero status.
# -E: If any command in a pipeline errors, the entire pipeline exits with a non-zero status.
# -x: Print each command before it is executed.
# -u: Treat unset variables as an error when substituting.
# -o pipefail: If any command in a pipeline fails, the entire pipeline fails.
set -eExuo pipefail

ARTIFACTS_DIRECTORY="/logs/artifacts"
NAMESPACE="redhat-data-federation"
GENERATED="cypress-gen"

# Declare and assign separately to avoid masking return values. Refer https://www.shellcheck.net/wiki/SC2155
BRIDGE_BASE_ADDRESS="$(oc get consoles.config.openshift.io cluster -o jsonpath='{.status.consoleURL}')"
BRIDGE_KUBEADMIN_PASSWORD="$(cat "${KUBEADMIN_PASSWORD_FILE:-${INSTALLER_DIR:=${ARTIFACTS_DIRECTORY}/installer}/auth/kubeadmin-password}")"

function generateLogsAndCopyArtifacts {
  oc cluster-info dump >>"${ARTIFACTS_DIRECTORY}"/cluster-info.json
  oc get catalogsource -n "$NAMESPACE" -o yaml >>"${ARTIFACTS_DIRECTORY}"/catalogsources.yaml
  oc get console.v1.operator.openshift.io cluster -o yaml >>"${ARTIFACTS_DIRECTORY}"/cluster.yaml
  oc get csvs -n "$NAMESPACE" -o yaml >>"${ARTIFACTS_DIRECTORY}"/clusterserviceversions.yaml
  oc get deployments -n "$NAMESPACE" -o yaml >>"${ARTIFACTS_DIRECTORY}"/deployments.yaml
  oc get pods -n "$NAMESPACE" -o yaml >>"${ARTIFACTS_DIRECTORY}"/pods.yaml
  oc get secrets -n "$NAMESPACE" -o yaml >>"${ARTIFACTS_DIRECTORY}"/secrets.yaml
  oc get serviceaccounts -n "$NAMESPACE" -o yaml >>"${ARTIFACTS_DIRECTORY}"/serviceaccount.yaml
  oc get services -n "$NAMESPACE" -o yaml >>"${ARTIFACTS_DIRECTORY}"/services.yaml
  oc get subscriptions -n "$NAMESPACE" -o yaml >>"${ARTIFACTS_DIRECTORY}"/subscriptions.yaml
  cp -r "$GENERATED" "$ARTIFACTS_DIRECTORY/$GENERATED"
}

# Gather cluster metadata on error or exit signals raised by this script.
trap generateLogsAndCopyArtifacts ERR
trap generateLogsAndCopyArtifacts EXIT

# Enable console plugin for mcg-ms-console
# Disable color codes in Cypress since they do not render well CI test logs.
# https://docs.cypress.io/guides/guides/continuous-integration.html#Colors
export NO_COLOR=1
export BRIDGE_BASE_ADDRESS
export BRIDGE_KUBEADMIN_PASSWORD

# Install dependencies.
yarn install

# Run tests.
yarn run test-cypress-headless

# Generate Cypress report.
yarn run cypress-postreport
