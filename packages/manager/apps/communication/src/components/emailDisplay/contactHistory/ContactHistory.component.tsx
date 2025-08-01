import { OdsDrawer, OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { Contact } from '@/data/types';
import Steps from '@/components/Steps/Steps.component';
import { getCleanEmail } from '@/utils/notifications';
import { urls } from '@/routes/routes.constant';
import './contactHistory.scss';
import AuthLink from '@/components/authLink/AuthLink.component';

type Props = {
  contacts: Array<Contact>;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function ContactHistory({ contacts, isOpen, onClose }: Props) {
  const { t } = useTranslation('detail');
  const formatDate = useFormatDate();

  return (
    <OdsDrawer
      title={t('history_overlay_headline')}
      isOpen={isOpen}
      position="right"
      className="contact-history-drawer"
    >
      <OdsButton
        variant="ghost"
        label=""
        icon="xmark"
        size="sm"
        color="neutral"
        className="-ml-4"
        onClick={onClose}
      />
      <OdsText preset="heading-4">{t('history_overlay_headline')}</OdsText>
      <OdsText>{t('history_overlay_description')}</OdsText>
      <AuthLink href={urls.SettingsTab}>
        {t('history_overlay_settings_link')}
      </AuthLink>

      <Steps
        steps={contacts.map((contact) => ({
          active: true,
          children: (
            <>
              <OdsText preset="paragraph">
                {formatDate({ date: contact.sentAt, format: 'Pp' })}
              </OdsText>
              <OdsText preset="paragraph" className="underline">
                {getCleanEmail(contact.to)}
              </OdsText>
            </>
          ),
        }))}
      />
    </OdsDrawer>
  );
}
