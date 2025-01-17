import {
  InstallationFormValues,
  InstallationFormErrors,
  SystemForm,
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
