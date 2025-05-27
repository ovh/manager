import { InstallationFormValues } from '@/types/form.type';
import { formMappers } from '../mappers/formMappers';

export const getSummaryJSON = (form: InstallationFormValues) =>
  JSON.stringify(formMappers.toStructured(form));

export const getSummaryFileName = (sapSid: string) =>
  `my-sap-installation-${sapSid || 'sapSid'}`;

export const getSummaryBlob = (form: InstallationFormValues) =>
  new Blob([getSummaryJSON(form)], { type: 'application/json' });
