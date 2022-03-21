import * as React from 'react';
import { RouteComponentProps } from 'react-router';

const CreateNamespaceStore: React.FC<CreateNamespaceStoreProps> = ({ match }) => {
    return (
        <div className="center-component">
            <>{"Data Federation ~ Sample Form"}</>
        </div>
    );
};

type CreateNamespaceStoreProps = RouteComponentProps<{ ns: string; appName: string }>;

export default CreateNamespaceStore;
