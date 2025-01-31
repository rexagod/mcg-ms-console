import * as React from "react";
import { useTranslation } from "react-i18next";
import { InProgressIcon } from "@patternfly/react-icons";
import GenericStatus from "./GenericStatus";
import {
  RedExclamationCircleIcon,
  GreenCheckCircleIcon,
  BlueInfoCircleIcon
} from "./icons";
import { StatusComponentProps } from "./types";

export const ErrorStatus: React.FC<StatusComponentProps> = (props) => (
  <GenericStatus {...props} Icon={RedExclamationCircleIcon} />
);
ErrorStatus.displayName = "ErrorStatus";

export const InfoStatus: React.FC<StatusComponentProps> = (props) => (
  <GenericStatus {...props} Icon={BlueInfoCircleIcon} />
);
InfoStatus.displayName = "InfoStatus";

export const ProgressStatus: React.FC<StatusComponentProps> = (props) => (
  <GenericStatus {...props} Icon={InProgressIcon} />
);
ProgressStatus.displayName = "ProgressStatus";

export const SuccessStatus: React.FC<StatusComponentProps> = (props) => {
  const { t } = useTranslation();
  return (
    <GenericStatus
      {...props}
      Icon={GreenCheckCircleIcon}
      title={props.title || t("Healthy")}
    />
  );
};
SuccessStatus.displayName = "SuccessStatus";
