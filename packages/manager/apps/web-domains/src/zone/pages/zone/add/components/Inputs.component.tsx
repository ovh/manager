import { type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";

import type { AddEntrySchemaType, RecordFieldDef } from "../../../../utils/formSchema.utils";
import { NumberField } from "./fields/NumberField";
import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { SelectField } from "./fields/SelectField";

interface RecordFieldInputsProps {
  control: Control<AddEntrySchemaType>;
  fields: RecordFieldDef[];
  fieldClassName?: string;
}

export function RecordFieldInputs({ fields, control, fieldClassName }: Readonly<RecordFieldInputsProps>) {
  if (fields.length === 0) return null;

  return (
    <>
      {fields.map((fieldDef) => (
        <RecordField key={fieldDef.name} fieldDef={fieldDef} control={control} fieldClassName={fieldClassName} />
      ))}
    </>
  );
}

function RecordField({
  fieldDef,
  control,
  fieldClassName,
}: Readonly<{
  fieldDef: RecordFieldDef;
  control: Control<AddEntrySchemaType>;
  fieldClassName?: string;
}>) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM, NAMESPACES.ACTIONS]);
  const name = fieldDef.name;
  const label = t(fieldDef.labelKey);
  const cls = fieldClassName ?? "mb-4 w-1/2";

  if (fieldDef.inputType === "select") {
    const items = (fieldDef.options ?? []).map((option) => ({
      label: option.labelKey ? t(option.labelKey) : option.value,
      value: option.value,
    }));
    return (
      <SelectField
        name={name}
        control={control}
        label={label}
        required={fieldDef.required}
        items={items}
        className={cls}
      />
    );
  }

  if (fieldDef.inputType === "textarea") {
    return (
      <TextareaField
        name={name}
        control={control}
        label={label}
        required={fieldDef.required}
        className={cls}
      />
    );
  }

  if (fieldDef.inputType === "number") {
    return (
      <NumberField
        name={name}
        control={control}
        label={label}
        required={fieldDef.required}
        min={fieldDef.min}
        max={fieldDef.max}
        step={fieldDef.step}
        className={cls}
      />
    );
  }

  return (
    <TextField
      name={name}
      control={control}
      label={label}
      required={fieldDef.required}
      tooltipKey={fieldDef.tooltipKey ? t(fieldDef.tooltipKey) : undefined}
      className={cls}
    />
  );
}
