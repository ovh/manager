import { Trans, useTranslation } from "react-i18next";
import { ICON_NAME, Message, MESSAGE_COLOR, MESSAGE_VARIANT, MessageBody, MessageIcon, Text, TEXT_PRESET, Textarea } from "@ovhcloud/ods-react";
import { useIsDesktop } from "@/zone/hooks/useIsDesktop";

export interface SPFRecordFormProps { readonly serviceName: string; }

export function SPFRecordForm({
  serviceName
}: SPFRecordFormProps) {
  const { t } = useTranslation(["zone"]);
  const isDesktop = useIsDesktop();
  const halfWidth = isDesktop ? 'w-1/2' : 'w-full';

  return (
    <div className="flex flex-col mb-2">
      <Text preset={TEXT_PRESET.paragraph} className="mb-2">
        {t("zone_page_form_spf_help", { domain: serviceName })}
      </Text>
      <div className={halfWidth}>
        <Textarea disabled readOnly className="w-full">
          {`${serviceName}. IN TXT "v=spf1 include:mx.ovh.com ~all"`}
        </Textarea>
      </div>
      <div className={halfWidth}>
        <Message color={MESSAGE_COLOR.information} variant={MESSAGE_VARIANT.light} className="mt-4" dismissible={false}>
          <MessageIcon name={ICON_NAME.circleInfo} />
          <MessageBody>
            <Trans
              t={t}
              i18nKey="zone_page_form_spf_custom_warning"
              components={{ link: <a href="#" className="text-[--ods-color-primary-500] underline cursor-pointer" /> }}
            />
          </MessageBody>
        </Message>
      </div>
    </div>
  );
}
