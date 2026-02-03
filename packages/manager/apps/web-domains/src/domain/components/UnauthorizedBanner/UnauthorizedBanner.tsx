import {
  Message,
  MESSAGE_COLOR,
  MessageIcon,
  ICON_NAME,
  MessageBody,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

export default function UnauthorizedBanner() {
  const { t } = useTranslation(['domain']);
  return (
    <Message
      color={MESSAGE_COLOR.warning}
      className="w-full"
      data-testid="warningMessage"
      dismissible={false}
    >
      <MessageIcon name={ICON_NAME.triangleExclamation} />
      <MessageBody>
        <Text preset={TEXT_PRESET.heading6}>
          {t('domain_tab_hosts_listing_warning_title')}
        </Text>
        <Text>{t('domain_tab_hosts_listing_warning_sub_1')}</Text>
        <Text>{t('domain_tab_hosts_listing_warning_sub_2')}</Text>
      </MessageBody>
    </Message>
  );
}
