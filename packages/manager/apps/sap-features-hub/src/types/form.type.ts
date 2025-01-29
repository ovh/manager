import { z } from 'zod';
import { TextFieldProps } from '@/components/Form/TextField.component';
import { PRE_INSTALLATION_FORM_SCHEMA } from '../schema/form.schema';

type InstallationForm = InitializationForm &
  DeploymentForm &
  SystemForm &
  SourceForm &
  OSConfigForm &
  PreInstallationForm;
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
export type PreInstallationFormSchema = z.infer<
  typeof PRE_INSTALLATION_FORM_SCHEMA
>;

export type PreInstallationForm = Pick<
  Partial<PreInstallationFormSchema>,
  'bucketBackint' | 'logsDataPlatform'
>;

export type SystemFormKeys = keyof SystemForm;
