import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  INPUT_TYPE,
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
}

export function SubDomainField({
  control,
  domainSuffix = "",
  className,
  required = true,
}: SubDomainFieldProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  return (
    <Controller
      name="subDomain"
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormField className={className ?? "w-full"} invalid={!!error && invalid}>
          <FormFieldLabel>
            {t("zone_page_add_entry_modal_step_1_subdomain")}
            {required && <span className="text-xs"> - {t(NAMESPACES.FORM + ":required_field")}</span>}
          </FormFieldLabel>
          <div className="flex w-full gap-2">
            <Input
              type={INPUT_TYPE.text}
              className="flex-1 min-w-0"
              name={field.name}
              value={String(field.value ?? "")}
              onBlur={field.onBlur}
              onChange={(e) => field.onChange(e.target?.value)}
              invalid={!!error}
            />
            <Input type={INPUT_TYPE.text} value={domainSuffix} readOnly disabled className="flex-1 min-w-0" />
          </div>
          <FormFieldError>{error?.message}</FormFieldError>
        </FormField>
      )}
    />
  );
}
