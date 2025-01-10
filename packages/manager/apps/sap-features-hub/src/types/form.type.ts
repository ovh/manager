export type InstallationForm = {
  serviceName: string;
  datacenterId: number;
  clusterName: string;
  applicationVersion: string;
  applicationType: string;
  deploymentType: string;
  sapSid: string;
  sapHanaSid: string;
  masterSapPassword: string;
  masterSapHanaPassword: string;
  sidamnPassword: string;
  systemPassword: string;
};

export type FormKey = keyof InstallationForm;

export type TextInputData<T = string> = {
  name: T;
  label: string;
  placeholder?: string;
  pattern?: string;
  helperKey?: string;
};

export type SystemFormKeys = keyof Pick<
  InstallationForm,
  | 'sapSid'
  | 'sapHanaSid'
  | 'masterSapPassword'
  | 'masterSapHanaPassword'
  | 'sidamnPassword'
  | 'systemPassword'
>;
