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
  CommonServerConfig,
  HanaServer,
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
  serviceDisplayName: string;
  datacenterId: number;
  datacenterName: string;
  clusterName: string;
  clusterId: number;
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

export type EnablementForm = {
  bucketBackint?: z.infer<typeof ENABLEMENT_BUCKET_BACKINT>;
  logsDataPlatform?: z.infer<typeof ENABLEMENT_LOGS_DATA_PLATFORM>;
};
