import * as React from "react";
import { K8sModel } from "@openshift-console/dynamic-plugin-sdk/lib/api/common-types";
import classNames from "classnames";
import { Link } from "react-router-dom";

type ResourceLinkProps = {
  resourceModel: K8sModel;
  resourceName: string;
  link: string;
  isExternalLink?: boolean;
  hideIcon?: boolean;
  className?: string;
};

type ResourceIconProps = {
  resourceModel: K8sModel;
  className?: string;
};

export const ResourceIcon: React.FC<ResourceIconProps> = ({
  resourceModel,
  className
}) => (
  <>
    <span className="sr-only">{resourceModel.abbr.toLocaleUpperCase()}</span>
    <span
      className={classNames("co-m-resource-icon", className)}
      title={resourceModel.kind}
    >
      {resourceModel.abbr.toLocaleUpperCase()}
    </span>
  </>
);

const ResourceLink: React.FC<ResourceLinkProps> = ({
  resourceModel,
  resourceName,
  link,
  isExternalLink,
  hideIcon,
  className
}) => {
  return (
    <span className="co-resource-item">
      {!hideIcon && (
        <>
          <span className="sr-only">
            {resourceModel.abbr.toLocaleUpperCase()}
          </span>
          <span className="co-m-resource-icon" title={resourceModel.kind}>
            {resourceModel.abbr.toLocaleUpperCase()}
          </span>
        </>
      )}
      {isExternalLink ? (
        <a
          className={className}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {resourceName}
        </a>
      ) : (
        <Link to={link} className={className}>
          {resourceName}
        </Link>
      )}
    </span>
  );
};

export default ResourceLink;
