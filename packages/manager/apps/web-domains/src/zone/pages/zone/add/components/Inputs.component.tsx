import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  Input,
  INPUT_TYPE,
  Select,
  SelectContent,
  SelectControl,
  Text,
  TEXT_PRESET,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Controller, type ControllerRenderProps, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { AddEntrySchemaType } from "../../../../utils/formSchema.utils";
import type { RecordFieldDef } from "../../../../utils/formSchema.utils";

interface RecordFieldInputsProps {
  control: Control<AddEntrySchemaType>;
  fields: RecordFieldDef[];
}

interface RecordFieldControllerRenderProps {
  fieldDef: RecordFieldDef;
  control: Control<AddEntrySchemaType>;
}

interface RecordInputProps {
  fieldDef: RecordFieldDef;
  field: ControllerRenderProps<AddEntrySchemaType, keyof AddEntrySchemaType>;
  invalid?: boolean;
}

export function RecordFieldInputs({ fields, control }: RecordFieldInputsProps) {
  if (fields.length === 0) return null;

  return (
    <>
      {fields.map((fieldDef) => (
        <RecordField key={fieldDef.name} fieldDef={fieldDef} control={control} />
      ))}
    </>
  );
}

function RecordField({ fieldDef, control }: RecordFieldControllerRenderProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);

  return (
    <Controller name={fieldDef.name as keyof AddEntrySchemaType}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormField className="mb-4 w-1/2" invalid={!!error && invalid}>
          <FormFieldLabel>
            {t(fieldDef.labelKey)}
            {fieldDef.required ? " *" : ""}
          </FormFieldLabel>
          <RecordInput fieldDef={fieldDef} field={field} invalid={!!error} />
          <FormFieldError>{error?.message}</FormFieldError>
        </FormField>
      )}
    />
  );
}

function RecordInput({ fieldDef, field, invalid }: RecordInputProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);

  if (fieldDef.inputType === "select") {
    const items = (fieldDef.options ?? []).map((option) => {
      const label = option.labelKey ? t(option.labelKey) : option.value;
      return { label, value: option.value };
    });

    return (
      <Select
        name={field.name}
        className="w-full"
        value={field.value != null ? [String(field.value)] : []}
        onValueChange={({ value }) => field.onChange(value[0] ?? "")}
        onBlur={() => field.onBlur?.()}
        items={items}
      >
        <SelectControl placeholder={t(`${NAMESPACES.ACTIONS}:select_imperative`)} />
        <SelectContent />
      </Select>
    );
  }

  if (fieldDef.inputType === "textarea") {
    return (
      <Textarea
        className="flex-1 min-h-24 w-full"
        name={field.name}
        value={(field.value as string) ?? ""}
        onChange={(event) => field.onChange(event.target?.value)}
        onBlur={field.onBlur}
        ref={field.ref}
        invalid={invalid}
      />
    );
  }

  const isNum = fieldDef.inputType === "number";
  const tooltipKey = fieldDef.tooltipKey;

  return (
    <div className="flex w-full gap-2">
      <Input
        type={isNum ? INPUT_TYPE.number : INPUT_TYPE.text}
        className="flex-1 min-w-0"
        name={field.name}
        value={isNum ? (field.value as number | string) ?? "" : (field.value as string) ?? ""}
        onChange={(event) => field.onChange(event.target?.value)}
        onBlur={field.onBlur}
        ref={field.ref}
        min={fieldDef.min}
        max={fieldDef.max}
        step={fieldDef.step}
        invalid={invalid}
      />
      {tooltipKey != null && (
        <Text preset={TEXT_PRESET.span}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon name={ICON_NAME.circleQuestion} />
            </TooltipTrigger>
            <TooltipContent>
              <Text preset={TEXT_PRESET.paragraph}>{t(tooltipKey)}</Text>
            </TooltipContent>
          </Tooltip>
        </Text>
      )}
    </div>
  );
}
