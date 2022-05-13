import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { BucketClassType } from "../constants";
import { nsSpecProvider, nsSpecType } from "./providers";


export type NamespaceStoreKind = K8sResourceCommon & {
    spec: {
        [key in nsSpecProvider]: {
            [key: string]: string;
        };
    } & {
        type: nsSpecType;
    };
};

export type BucketClassKind = K8sResourceCommon & {
    spec: {
        namespacePolicy: {
            single: {
                resource: string;
            },
            type: BucketClassType.SINGLE;
        } | {
            multi: {
                writeResource: string;
                readResources: string[];
            },
            type: BucketClassType.MULTI;
        };
    }
};
