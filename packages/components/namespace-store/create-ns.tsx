import * as React from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import "../noobaa-provider-endpoints/noobaa-provider-endpoints.scss";
import { Title } from "@patternfly/react-core";
import { DATA_FEDERATION_NAMESPACE } from "../../constants";
import { NooBaaNamespaceStoreModel } from "../../models";
import { referenceForModel } from "../../utils";
import { getName } from "../../utils/selectors/k8s";
import NamespaceStoreForm from "./namespace-store-form";

const CreateNamespaceStore: React.FC<CreateNamespaceStoreProps> = ({
  history,
  match
}) => {
  const { t } = useTranslation("plugin__mcg-ms-console");
  const { ns = DATA_FEDERATION_NAMESPACE } = match.params;
  const onCancel = () => history.goBack();

  return (
    <>
      <div className="co-create-operand__header">
        <Title
          size="2xl"
          headingLevel="h1"
          className="co-create-operand__header-text"
        >
          {t("Create NamespaceStore ")}
        </Title>
        <p className="help-block">
          {t(
            "Represents an underlying storage to be used as read or write target for the data in the namespace buckets."
          )}
        </p>
      </div>
      <NamespaceStoreForm
        onCancel={onCancel}
        redirectHandler={(resources) => {
          const lastIndex = resources.length - 1;
          const resourcePath = `${referenceForModel(
            NooBaaNamespaceStoreModel
          )}/${getName(resources[lastIndex])}`;
          history.push(`/mcgms/resource/${resourcePath}`);
        }}
        namespace={ns}
        className="nb-endpoints-page-form__short"
      />
    </>
  );
};

type CreateNamespaceStoreProps = RouteComponentProps<{
  ns: string;
  appName: string;
}>;

export default CreateNamespaceStore;
