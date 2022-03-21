import * as React from 'react';
import { RouteComponentProps } from 'react-router';

const CreateBackingStore: React.FC<CreateBackingStoreProps> = ({ match }) => {
    return (
        <div className="center-component">
            <>{"Data Federation ~ Sample Form"}</>
        </div>
    );
};

type CreateBackingStoreProps = RouteComponentProps<{ ns: string; appName: string }>;

export default CreateBackingStore;
