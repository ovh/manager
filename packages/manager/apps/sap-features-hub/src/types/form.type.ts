import { z } from 'zod';
import { TextFieldProps } from '@/components/Form/TextField.component';
import {
  ENABLEMENT_BUCKET_BACKINT,
  ENABLEMENT_FORM_SCHEMA,
  ENABLEMENT_LOGS_DATA_PLATFORM,
} from '../schema/form.schema';

import { DeploymentType } from './sapCapabilities.type';
import {
  ApplicationServer,
  ApplicationServerExport,
  CommonServerConfig,
  HanaServer,
  HanaServerExport,
} from './servers.type';

type InstallationForm = InitializationForm &
  DeploymentForm &
  SystemForm &
  SourceForm &
  OSConfigForm &
  ServerConfigForm &
  EnablementForm;
export type FormKey = keyof InstallationForm;

export type InstallationFormErrors = Record<FormKey, string>;
export type InstallationFormValues = {
  [K in FormKey]: InstallationForm[K];
};

export type TextInputData<T = string> = {
  name: T;
  helperKey?: string;
} & Pick<TextFieldProps, 'label' | 'placeholder' | 'validator'>;

export type InitializationForm = {
  serviceName: string;
  serviceDisplayName?: string;
  datacenterId: number;
  datacenterName?: string;
  clusterName: string;
  clusterId?: number;
};

export type DeploymentForm = {
  applicationVersion: string;
  applicationType: string;
  deploymentType: DeploymentType;
};
export type SystemForm = {
  sapSid: string;
  sapHanaSid: string;
  masterSapPassword: string;
  masterSapHanaPassword: string;
  sidadmPassword: string;
  systemPassword: string;
};
export type SourceForm = {
  bucketId: string;
  endpoint: string;
  accessKey: string;
  secretKey: string;
};
export type OSConfigForm = {
  domainName: string;
  osLicense: string;
  osUpdate: boolean;
  firewallService: boolean;
  firewallServer: boolean;
  firewallDatabase: boolean;
};
export type ServerConfigForm = CommonServerConfig & {
  hanaServers: HanaServer[];
  applicationServers: ApplicationServer[];
};

export type EnablementFormSchema = z.infer<typeof ENABLEMENT_FORM_SCHEMA>;
type BucketBackint = z.infer<typeof ENABLEMENT_BUCKET_BACKINT>;
type LogsDataPlatform = z.infer<typeof ENABLEMENT_LOGS_DATA_PLATFORM>;

export type EnablementForm = {
  bucketBackint?: BucketBackint;
  logsDataPlatform?: LogsDataPlatform;
};

// structured form ready to be stringify according to the API
export type StructuredInstallationForm = {
  applicationServers: ApplicationServerExport[];
  applicationType: string;
  applicationVersion: string;
  bucketBackint?: BucketBackint;
  bucketSources: {
    accessKey: string;
    endpoint: string;
    id: string;
    secretKey: string;
  };
  clusterName: string;
  deploymentType: DeploymentType;
  domainName: string;
  firewall: {
    applicationServers: boolean;
    centralServices: boolean;
    hanaDatabase: boolean;
  };
  hanaServers: HanaServerExport[];
  logsDataPlatform?: LogsDataPlatform;
  osLicense?: string;
  osUpdate: boolean;
  passwords: {
    masterSap: string;
    masterSapHana: string;
    sidadm: string;
    system: string;
  };
  serviceName: string;
  sids: {
    sapHanaSid: string;
    sapSid: string;
  };
  systemUsage: string;
  datacenterId: number;
};
