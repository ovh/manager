import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  Select,
  SelectContent,
  SelectControl,
  type SelectCustomOptionRendererArg,
  Text,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export interface SelectFieldProps {
  readonly name: keyof AddEntrySchemaType;
  readonly control: Control<AddEntrySchemaType>;
  readonly label: string;
  readonly required?: boolean;
  readonly items: { label: string; value: string; description?: string }[];
  readonly placeholder?: string;
  readonly className?: string;
  readonly tooltip?: string;
  readonly disabled?: boolean;
}

export function SelectField({
  name,
  control,
  label,
  required = false,
  items,
  placeholder,
  className,
  tooltip,
  disabled,
}: SelectFieldProps) {
  const { t } = useTranslation([NAMESPACES.ACTIONS, NAMESPACES.FORM]);

  const hasDescriptions = items.some((item) => item.description);

  function renderOptionWithDescription({
    customData,
    label: optionLabel,
  }: SelectCustomOptionRendererArg<{ description?: string }>) {
    return (
      <div className="flex items-center gap-1">
        <span className="font-medium">{optionLabel}</span>
        {customData?.description && (
          <span className="text-xs text-[--ods-color-text-muted]">— {customData.description}</span>
        )}
      </div>
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormField className={className} invalid={!!error && invalid}>
          <FormFieldLabel>
            {label}
            {required && <span className="text-xs"> - {t(NAMESPACES.FORM + ":required_field")}</span>}
            {tooltip != null && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon name={ICON_NAME.circleQuestion} className="text-[--ods-color-primary-500] ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <Text preset={TEXT_PRESET.paragraph}>{tooltip}</Text>
                </TooltipContent>
              </Tooltip>
            )}
          </FormFieldLabel>
          <Select
            name={field.name}
            className="w-full"
            value={field.value == null ? [] : [field.value as string]}
            onValueChange={({ value }) => field.onChange(value[0] ?? "")}
            onBlur={() => field.onBlur?.()}
            disabled={disabled}
            items={items.map(({ label: l, value: v, description }) => ({
              label: l,
              value: v,
              ...(description ? { customRendererData: { description } } : {}),
            }))}
          >
            <SelectControl
              className="truncate [&_*]:truncate"
              placeholder={placeholder ?? t(`${NAMESPACES.ACTIONS}:select_imperative`)}
            />
            <SelectContent
              customOptionRenderer={hasDescriptions ? renderOptionWithDescription : undefined}
            />
          </Select>
          <FormFieldError>{error?.message}</FormFieldError>
        </FormField>
      )}
    />
  );
}
