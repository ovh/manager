import { z } from 'zod';
import { TextFieldProps } from '@/components/Form/TextField.component';
import { ENABLEMENT_FORM_SCHEMA } from '../schema/form.schema';

type InstallationForm = InitializationForm &
  DeploymentForm &
  SystemForm &
  SourceForm &
  OSConfigForm &
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
  datacenterId: number;
  clusterName: string;
};
export type DeploymentForm = {
  applicationVersion: string;
  applicationType: string;
  deploymentType: string;
};
export type SystemForm = {
  sapSid: string;
  sapHanaSid: string;
  masterSapPassword: string;
  masterSapHanaPassword: string;
  sidamnPassword: string;
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
export type EnablementFormSchema = z.infer<typeof ENABLEMENT_FORM_SCHEMA>;

export type EnablementForm = Pick<
  Partial<EnablementFormSchema>,
  'bucketBackint' | 'logsDataPlatform'
>;

export type SystemFormKeys = keyof SystemForm;
