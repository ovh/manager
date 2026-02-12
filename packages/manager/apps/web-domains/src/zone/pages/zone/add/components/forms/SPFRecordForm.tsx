import { useTranslation } from "react-i18next";
import { ICON_NAME, Message, MESSAGE_COLOR, MESSAGE_VARIANT, MessageBody, MessageIcon, Text, TEXT_PRESET, Textarea } from "@ovhcloud/ods-react";

export interface SPFRecordFormProps { readonly serviceName: string; }

export function SPFRecordForm({
  serviceName
}: SPFRecordFormProps) {
  const { t } = useTranslation(["zone"]);

  return (
    <div className="flex flex-col mb-2">
      <Text preset={TEXT_PRESET.paragraph} className="mb-2">
        {t("zone_page_add_entry_modal_step_2_spf_help", { domain: serviceName })}
      </Text>
      <Textarea disabled readOnly className="w-1/2">
        {`${serviceName}. IN TXT "v=spf1 include:mx.ovh.com ~all"`}
      </Textarea>
      <Message color={MESSAGE_COLOR.information} variant={MESSAGE_VARIANT.light} className="mt-4 w-1/2" dismissible={false}>
        <MessageIcon name={ICON_NAME.circleInfo} />
        <MessageBody>
          {t("zone_page_add_entry_modal_spf_custom_warning")}
        </MessageBody>
      </Message>
    </div>
  );
}
