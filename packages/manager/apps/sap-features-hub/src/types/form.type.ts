import { TextFieldProps } from '@/components/Form/TextField.component';

type InstallationForm = InitializationForm & DeploymentForm & SystemForm;
export type FormKey = keyof InstallationForm;

export type InstallationFormErrors = Record<FormKey, string>;
export type InstallationFormValues = {
  [K in FormKey]: InstallationForm[K];
};

export type TextInputData<T = string> = {
  name: T;
  helperKey?: string;
} & Pick<
  TextFieldProps,
  'label' | 'placeholder' | 'pattern' | 'minlength' | 'maxlength' | 'isRequired'
>;

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
export type SystemFormKeys = keyof SystemForm;
