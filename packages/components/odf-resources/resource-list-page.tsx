import * as React from 'react';
import {
    ListPageCreateLink,
    ListPageHeader,
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sKind } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';
import { useTranslation } from 'react-i18next';
import { NooBaaBackingStoreModel, NooBaaBucketClassModel, NooBaaNamespaceStoreModel } from '../../models';

type GenericListPageProps = {
    model: K8sKind;
};

const GenericListPage: React.FC<GenericListPageProps> = (props) => {
    const { model } = props;
    const resourceKind = model.kind;
    const { t } = useTranslation('plugin__dfr-console');

    const createLink = `/dfr/resource/${model.apiGroup}~${model.apiVersion}~${resourceKind}/create/~new`;
    return (
        <>
            <ListPageHeader title={resourceKind}>
                <ListPageCreateLink to={createLink}>
                    {t('Create {{kind}}', { kind: resourceKind })}
                </ListPageCreateLink>
            </ListPageHeader>
            <div className="center-component">
                <>{"Data Federation ~ Sample List Page"}</>
            </div>
        </>
    );
};

export const BackingStoreListPage: React.FC = () => (
    <GenericListPage model={NooBaaBackingStoreModel} />
);

export const BucketClassListPage: React.FC = () => (
    <GenericListPage model={NooBaaBucketClassModel} />
);

export const NamespaceStoreListPage: React.FC = () => (
    <GenericListPage model={NooBaaNamespaceStoreModel} />
);
