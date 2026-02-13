import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
  TEXT_PRESET,
  Textarea,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";   
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export function SpfFormContent() {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  const { serviceName } = useParams<{ serviceName: string }>();
  const { control } = useFormContext<AddEntrySchemaType>();
const RadioKeys= [
  { value: "true", labelKey: "yes" },
  { value: "false", labelKey: "no" },
]
  return (
    <div className="mt-4 w-full" data-testid="spf-form">

      <FormField className="mb-4">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_spf_senders_ip_title", {
             serviceName,
          })}
        </FormFieldLabel>
        <Controller
          name="aSender"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value?.toString() ?? ""}
              onValueChange={(detail) => {
                field.onChange(detail.value === "true");
              }}
            >
              <div className="flex flex-row gap-4 mt-2">
                {RadioKeys.map(({ value, labelKey }) => (
                  <Radio key={value} value={value}>
                    <RadioControl />
                    <RadioLabel className="ml-2">
                      <Text preset={TEXT_PRESET.span}>{t(`${NAMESPACES.FORM}:${labelKey}`)}</Text>
                    </RadioLabel>
                  </Radio>
                ))}
              </div>
            </RadioGroup>
          )}
        />
      </FormField>

     
      <FormField className="mb-4">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_spf_senders_mx_title", {
            serviceName,
          })}
        </FormFieldLabel>
        <Controller
          name="mxSender"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value?.toString() ?? ""}
              onValueChange={(detail) => {
                field.onChange(detail.value === "true");
              }}
            >
              <div className="flex flex-row gap-4 mt-2">
                {RadioKeys.map(({ value, labelKey }) => (
                  <Radio key={value} value={value}>
                    <RadioControl />
                    <RadioLabel className="ml-2">
                      <Text preset={TEXT_PRESET.span}>{t(`${NAMESPACES.FORM}:${labelKey}`)}</Text>
                    </RadioLabel>
                  </Radio>
                ))}
              </div>
            </RadioGroup>
          )}
        />
      </FormField>

      <FormField className="mb-4">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_spf_senders_all_title", {
            serviceName,
          })}
        </FormFieldLabel>
        <Controller
          name="ptrSender"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value?.toString() ?? ""}
              onValueChange={(detail) => {
                field.onChange(detail.value === "true");
              }}
            >
              <div className="flex flex-row gap-4 mt-2">
                {RadioKeys.map(({ value, labelKey }) => (
                  <Radio key={value} value={value}>
                    <RadioControl />
                    <RadioLabel className="ml-2">
                      <Text preset={TEXT_PRESET.span}>{t(`${NAMESPACES.FORM}:${labelKey}`)}</Text>
                    </RadioLabel>
                  </Radio>
                ))}
              </div>
            </RadioGroup>
          )}
        />
      </FormField>

      <div className="mb-4">
        <Text preset={TEXT_PRESET.paragraph} className="mb-3">
          {t("zone_page_add_entry_modal_spf_other_title", {
            serviceName,
          })}
        </Text>

        <Controller
          name="a"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField className="mb-3 w-1/2" invalid={!!error}>
              <FormFieldLabel>a:</FormFieldLabel>
              <Textarea
                {...field}
                className="w-full min-h-24 resize-y"
                value={
                  typeof field.value === "string" ||
                  typeof field.value === "number" ||
                  Array.isArray(field.value)
                    ? field.value
                    : ""
                }
              />
              <FormFieldError>
                {typeof error?.message === "string" ? error.message : ""}
              </FormFieldError>
            </FormField>
          )}
        />

        <Controller
          name="mx"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField className="mb-3 w-1/2" invalid={!!error}>
              <FormFieldLabel>mx:</FormFieldLabel>
              <Textarea
                {...field}
                value={
                  typeof field.value === "string" ||
                  typeof field.value === "number" ||
                  Array.isArray(field.value)
                    ? field.value
                    : ""
                }
                className="w-full min-h-24 resize-y"
              />
              <FormFieldError>
                {typeof error?.message === "string" ? error.message : ""}
              </FormFieldError>
            </FormField>
          )}
        />

        <Controller
          name="ptr"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField className="mb-3 w-1/2" invalid={!!error}>
              <FormFieldLabel>ptr:</FormFieldLabel>
              <Textarea
                {...field}
                value={typeof field.value === "string" || typeof field.value === "number" || Array.isArray(field.value) ? field.value : ""}
                className="w-full min-h-24 resize-y"
              />
              <FormFieldError>{typeof error?.message === "string" ? error.message : ""}</FormFieldError>
            </FormField>
          )}
        />

        <Controller 
          name="ip4"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField className="mb-3 w-1/2" invalid={!!error}>
              <FormFieldLabel>ip4:</FormFieldLabel>
              <Textarea
                {...field}
                value={
                  typeof field.value === "string" ||
                  typeof field.value === "number" ||
                  Array.isArray(field.value)
                    ? field.value
                    : ""
                }
                className="w-full min-h-24 resize-y"
              />
              <FormFieldError>
                {typeof error?.message === "string" ? error.message : ""}
              </FormFieldError>
            </FormField>
          )}
        />

        <Controller
          name="ip6"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField className="mb-3 w-1/2" invalid={!!error}>
              <FormFieldLabel>ip6:</FormFieldLabel>
              <Textarea
                {...field}
                value={
                  typeof field.value === "string" ||
                  typeof field.value === "number" ||
                  Array.isArray(field.value)
                    ? field.value
                    : ""
                }
                className="w-full min-h-24 resize-y"
              />
              <FormFieldError>
                {typeof error?.message === "string" ? error.message : ""}
              </FormFieldError>
            </FormField>
          )}
        />
      </div>

      <div className="mb-4">
        <Text preset={TEXT_PRESET.paragraph} className="mb-3">
          {t("zone_page_add_entry_modal_spf_other_ds_title", {
            serviceName,
          })}
        </Text>
        <Controller
          name="include"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField className="w-1/2" invalid={!!error}>
              <FormFieldLabel>include:</FormFieldLabel>
              <Input
                {...field}
                type="text"
                maxLength={255}
                className="w-full"
                value={
                  typeof field.value === "string" ||
                  typeof field.value === "number" ||
                  Array.isArray(field.value)
                    ? field.value
                    : ""
                }
              />
              <FormFieldError>
                {typeof error?.message === "string" ? error.message : ""}
              </FormFieldError>
            </FormField>
          )}
        />
      </div>

      <FormField className="mb-4">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_spf_all_title", { 
            serviceName,
          })}
        </FormFieldLabel>
        <Controller
          name='all'
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={typeof field.value === "string" ? field.value : ""}
              onValueChange={(detail: { value: string }) => {
                field.onChange(detail.value);
              }}
              className="flex flex-col gap-2 mt-2"
            >
              <Radio value="-all">
                <RadioControl />
                <RadioLabel className="ml-2"><Text preset={TEXT_PRESET.span}>{t("zone_page_add_entry_modal_spf_all_title_yes")}</Text></RadioLabel>
              </Radio>
              <Radio value="~all">
                <RadioControl />
                <RadioLabel className="ml-2"><Text preset={TEXT_PRESET.span}>{t("zone_page_add_entry_modal_spf_all_title_safe")}</Text></RadioLabel>
              </Radio>
              <Radio value="?all">
                <RadioControl />
                <RadioLabel className="ml-2"><Text preset={TEXT_PRESET.span}>{t("zone_page_add_entry_modal_spf_all_title_no")}</Text></RadioLabel>
              </Radio>
            </RadioGroup>
          )}
        />
      </FormField>
    </div>
  );
}
