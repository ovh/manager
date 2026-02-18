import {
  FormField,
  FormFieldError,
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
  control: Control<AddEntrySchemaType>;
  domainSuffix?: string;
  className?: string;
  required?: boolean;
  tooltip?: string;
  placeholder?: string;
  labelKey?: string;
}

export function SubDomainField({
  control,
  domainSuffix = "",
  className,
  required = true,
  tooltip,
  placeholder,
  labelKey,
}: SubDomainFieldProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  return (
    <Controller
      name="subDomain"
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormField className={className ?? "w-full"} invalid={!!error && invalid}>
          <FormFieldLabel>
            {t(labelKey ?? "zone_page_form_subdomain")}
            {required && <span className="text-xs"> - {t(NAMESPACES.FORM + ":required_field")}</span>}
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
          <div className="flex w-full gap-2">
            <div className="relative w-full">
              <Input
                type={INPUT_TYPE.text}
                className="w-full"
                style={domainSuffix ? { paddingRight: `${domainSuffix.length + 4}ch` } : undefined}
                name={field.name}
                value={String(field.value ?? "")}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e.target?.value)}
                invalid={!!error}
                placeholder={placeholder}
              />
              {domainSuffix && (
                <span className="absolute right-0 top-0 h-full flex items-center px-3 text-[--ods-color-neutral-600] text-sm pointer-events-none">
                  .{domainSuffix}.
                </span>
              )}
            </div>
          </div>
          <FormFieldError>{error?.message}</FormFieldError>
        </FormField>
      )}
    />
  );
}
