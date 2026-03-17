import { FormField, FormFieldLabel, Textarea } from '@ovhcloud/ods-react';

export function RecordPreviewBox({
  label,
  record,
}: {
  readonly label: string;
  readonly record: string;
}) {
  return (
    <FormField>
      <FormFieldLabel className="items-baseline">{label}</FormFieldLabel>
      <Textarea className="w-full font-mono py-2" value={record} disabled readOnly />
    </FormField>
  );
}
