import {
  InstallationFormValues,
  InstallationFormErrors,
  SystemForm,
  SourceForm,
} from '@/types/form.type';

export const getSystemFormData = (
  form: InstallationFormValues | InstallationFormErrors,
): SystemForm => ({
  sapSid: form.sapSid,
  sapHanaSid: form.sapHanaSid,
  masterSapPassword: form.masterSapPassword,
  masterSapHanaPassword: form.masterSapHanaPassword,
  sidamnPassword: form.sidamnPassword,
  systemPassword: form.systemPassword,
});

export const getSourceFormData = (
  form: InstallationFormValues | InstallationFormErrors,
): SourceForm => ({
  bucketId: form.bucketId,
  endpoint: form.endpoint,
  accessKey: form.accessKey,
  secretKey: form.secretKey,
});
