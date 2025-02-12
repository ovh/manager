import {
  InstallationFormValues as InstallationForm,
  SystemForm,
  SourceForm,
  OSConfigForm,
  FormKey,
} from '@/types/form.type';

export type FormStepData<T> = {
  values: T;
  errors: Record<keyof T, string>;
};

export type SelectFormData<U extends FormKey> = FormStepData<
  InstallationForm
> & {
  keys: U[];
};

export const getFormData = <U extends FormKey>({
  values,
  errors,
  keys,
}: SelectFormData<U>): FormStepData<Pick<InstallationForm, U>> => {
  return keys.reduce(
    (form, key) => ({
      ...form,
      values: { ...form.values, [key]: values[key] ?? null },
      errors: { ...form.errors, [key]: errors[key] ?? '' },
    }),
    { values: {}, errors: {} } as FormStepData<Pick<InstallationForm, U>>,
  );
};

export const getSystemFormData = ({
  values,
  errors,
}: FormStepData<InstallationForm>): FormStepData<SystemForm> => {
  const keys: Array<keyof SystemForm> = [
    'sapSid',
    'sapHanaSid',
    'masterSapPassword',
    'masterSapHanaPassword',
    'sidadmPassword',
    'systemPassword',
  ];
  return getFormData({ values, errors, keys });
};

export const getSourceFormData = ({
  values,
  errors,
}: FormStepData<InstallationForm>): FormStepData<SourceForm> => {
  const keys: Array<keyof SourceForm> = [
    'bucketId',
    'endpoint',
    'accessKey',
    'secretKey',
  ];
  return getFormData({ values, errors, keys });
};

export const getOSConfigFormData = ({
  values,
  errors,
}: FormStepData<InstallationForm>): FormStepData<OSConfigForm> => {
  const keys: Array<keyof OSConfigForm> = [
    'domainName',
    'osLicense',
    'osUpdate',
    'firewallService',
    'firewallServer',
    'firewallDatabase',
  ];
  return getFormData({ values, errors, keys });
};
