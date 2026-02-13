import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  TEXT_PRESET,
  Text,
  Textarea,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

interface SpfFormHeaderProps {
  serviceName: string;
}

export function SpfFormHeader({ serviceName }: SpfFormHeaderProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  const { setValue } = useFormContext<AddEntrySchemaType>();

  const handleUseSpfOvh = () => {
    const spfIncludeName = "mx.ovh.com";
    const spfValue = `v=spf1 include:${spfIncludeName} ~all`;
    setValue("target", spfValue);
    setValue("subDomain", "");
  };

  return (
    <div className="mb-2">
      <Text preset={TEXT_PRESET.paragraph} className="mb-2">
        {t("zone_page_add_entry_modal_step_2_spf_help", { domain: serviceName })}
      </Text>
      <Textarea disabled readOnly className="w-full">
        {`${serviceName}. IN TXT "v=spf1 include:mx.ovh.com ~all"`}
      </Textarea>
      <Button
        variant={BUTTON_VARIANT.outline}
        size={BUTTON_SIZE.sm}
        onClick={handleUseSpfOvh}
        className="mt-4"
      >
        {t("zone_page_add_entry_modal_spf_button_use_spf_ovh")}
      </Button>
    </div>
  );
}
