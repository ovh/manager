import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  Input,
  INPUT_TYPE,
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

export interface SubDomainFieldProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly className?: string;
  readonly required?: boolean;
  readonly readOnly?: boolean;
  readonly tooltip?: string;
  readonly placeholder?: string;
  readonly labelKey?: string;
  readonly hideHelper?: boolean;
  readonly helperKey?: string;
  /** Fixed suffix displayed after the input (e.g. "._domainkey"). */
  readonly suffix?: string;
}

export function SubDomainField({
  control,
  className,
  required = true,
  readOnly = false,
  tooltip,
  placeholder,
  labelKey,
  hideHelper = false,
  helperKey,
  suffix,
}: SubDomainFieldProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  return (
    <Controller
      name="subDomain"
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormField className={className ?? "w-full"} invalid={!!error && invalid}>
          <FormFieldLabel className="items-baseline">
            {t(labelKey ?? "zone_page_form_subdomain")}
            {required && !readOnly && <span className="text-xs"> - {t(NAMESPACES.FORM + ":required_field")}</span>}
            {tooltip && (
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
          <div className={suffix ? "relative" : undefined}>
            <Input
              type={INPUT_TYPE.text}
              className={readOnly ? "w-full border-[--ods-color-neutral-200]" : suffix ? "w-full pr-[7rem] bg-white" : "w-full bg-white"}
              name={field.name}
              value={String(field.value ?? "")}
              onBlur={field.onBlur}
              onChange={(e) => field.onChange(e.target?.value)}
              invalid={!!error}
              placeholder={placeholder}
              readOnly={readOnly}
            />
            {suffix && (
              <Text preset={TEXT_PRESET.span} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">{suffix}</Text>
            )}
          </div>
          {!hideHelper && !readOnly && <FormFieldHelper><Text preset={TEXT_PRESET.caption}>{t(helperKey ?? "zone_page_form_subdomain_helper")}</Text></FormFieldHelper>}
          <FormFieldError>{error?.message}</FormFieldError>
        </FormField>
      )}
    />
  );
}
