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
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

const TOOLTIP_KEYS = {
  flag: "zone_page_add_entry_modal_step_2_naptr_flag_help",
  service: "zone_page_add_entry_modal_step_2_naptr_service_help",
  regex: "zone_page_add_entry_modal_step_2_naptr_regex_help",
  replace: "zone_page_add_entry_modal_step_2_naptr_replace_help",
} as const;

export function NaptrFormContent() {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  const { control, watch } = useFormContext<AddEntrySchemaType>();
  const regexValue = watch("regex");
  const replaceValue = watch("replace");
  const hasRegex = regexValue != null && String(regexValue).trim() !== "";
  const hasReplace = replaceValue != null && String(replaceValue).trim() !== "";
  const regexDisabled = hasReplace;
  const replaceDisabled = hasRegex;

  return (
    <div className="mt-4 w-full space-y-4" data-testid="naptr-form">
      <Controller
        name="order"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <FormField className="w-1/2" invalid={!!error && invalid}>
            <FormFieldLabel>
              {t("zone_page_add_entry_modal_step_2_label_naptr_order")} *
            </FormFieldLabel>
            <Input
              type={INPUT_TYPE.number}
              className="w-full"
              name={field.name}
              value={field.value !== undefined && field.value !== "" ? String(field.value) : ""}
              onChange={(e) =>
                field.onChange(
                  e.target?.value === "" ? undefined : Number(e.target?.value),
                )
              }
              onBlur={field.onBlur}
              ref={field.ref}
              min={0}
              max={65535}
              step={1}
              invalid={!!error}
            />
            <FormFieldError>{error?.message}</FormFieldError>
          </FormField>
        )}
      />

      <Controller
        name="pref"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <FormField className="w-1/2" invalid={!!error && invalid}>
            <FormFieldLabel>
              {t("zone_page_add_entry_modal_step_2_label_naptr_pref")} *
            </FormFieldLabel>
            <Input
              type={INPUT_TYPE.number}
              className="w-full"
              name={field.name}
              value={field.value !== undefined && field.value !== "" ? String(field.value) : ""}
              onChange={(e) =>
                field.onChange(
                  e.target?.value === "" ? undefined : Number(e.target?.value),
                )
              }
              onBlur={field.onBlur}
              ref={field.ref}
              min={0}
              max={65535}
              step={1}
              invalid={!!error}
            />
            <FormFieldError>{error?.message}</FormFieldError>
          </FormField>
        )}
      />

      <Controller
        name="flag"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <FormField className="w-1/2" invalid={!!error && invalid}>
            <FormFieldLabel>
              {t("zone_page_add_entry_modal_step_2_label_naptr_flag")}
            </FormFieldLabel>
            <div className="flex w-full gap-2">
              <Input
                type={INPUT_TYPE.text}
                className="flex-1 max-w-[4rem]"
                name={field.name}
                value={String(field.value ?? "")}
                onChange={(e) => field.onChange(e.target?.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                maxLength={1}
                invalid={!!error}
              />
              <Text preset={TEXT_PRESET.span}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name={ICON_NAME.circleQuestion} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text preset={TEXT_PRESET.paragraph}>{t(TOOLTIP_KEYS.flag)}</Text>
                  </TooltipContent>
                </Tooltip>
              </Text>
            </div>
            <FormFieldError>{error?.message}</FormFieldError>
          </FormField>
        )}
      />

      <Controller
        name="service"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <FormField className="w-1/2" invalid={!!error && invalid}>
            <FormFieldLabel>
              {t("zone_page_add_entry_modal_step_2_label_naptr_service")} *
            </FormFieldLabel>
            <div className="flex w-full gap-2">
              <Input
                type={INPUT_TYPE.text}
                className="flex-1"
                name={field.name}
                value={String(field.value ?? "")}
                onChange={(e) => field.onChange(e.target?.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                invalid={!!error}
              />
              <Text preset={TEXT_PRESET.span}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name={ICON_NAME.circleQuestion} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text preset={TEXT_PRESET.paragraph}>{t(TOOLTIP_KEYS.service)}</Text>
                  </TooltipContent>
                </Tooltip>
              </Text>
            </div>
            <FormFieldError>{error?.message}</FormFieldError>
          </FormField>
        )}
      />

      <Controller
        name="regex"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <FormField className="w-1/2" invalid={!!error && invalid}>
            <FormFieldLabel>
              {t("zone_page_add_entry_modal_step_2_label_naptr_regex")}
            </FormFieldLabel>
            <div className="flex w-full gap-2">
              <Input
                type={INPUT_TYPE.text}
                className="flex-1"
                name={field.name}
                value={String(field.value ?? "")}
                onChange={(e) => field.onChange(e.target?.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                invalid={!!error}
                disabled={regexDisabled}
              />
              <Text preset={TEXT_PRESET.span}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name={ICON_NAME.circleQuestion} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text preset={TEXT_PRESET.paragraph}>{t(TOOLTIP_KEYS.regex)}</Text>
                  </TooltipContent>
                </Tooltip>
              </Text>
            </div>
            <FormFieldError>{error?.message}</FormFieldError>
          </FormField>
        )}
      />

      <Controller
        name="replace"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <FormField className="w-1/2" invalid={!!error && invalid}>
            <FormFieldLabel>
              {t("zone_page_add_entry_modal_step_2_label_naptr_replace")}
            </FormFieldLabel>
            <div className="flex w-full gap-2">
              <Input
                type={INPUT_TYPE.text}
                className="flex-1"
                name={field.name}
                value={String(field.value ?? "")}
                onChange={(e) => field.onChange(e.target?.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                invalid={!!error}
                disabled={replaceDisabled}
              />
              <Text preset={TEXT_PRESET.span}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name={ICON_NAME.circleQuestion} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text preset={TEXT_PRESET.paragraph}>{t(TOOLTIP_KEYS.replace)}</Text>
                  </TooltipContent>
                </Tooltip>
              </Text>
            </div>
            <FormFieldError>{error?.message}</FormFieldError>
          </FormField>
        )}
      />
    </div>
  );
}
