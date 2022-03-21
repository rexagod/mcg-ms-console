import * as React from 'react';
import { RouteComponentProps } from 'react-router';

const CreateBucketClass: React.FC<CreateBucketClassProps> = ({ match }) => {
    return (
        <div className="center-component">
            <>{"Data Federation ~ Sample Form"}</>
        </div>
    );
};

type CreateBucketClassProps = RouteComponentProps<{ ns: string; appName: string }>;

export default CreateBucketClass;
