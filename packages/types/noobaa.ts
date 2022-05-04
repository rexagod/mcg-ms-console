import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
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
