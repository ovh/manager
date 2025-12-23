import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsIcon, OdsPopover, OdsText } from '@ovhcloud/ods-components/react';
import { Trans, useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Contact } from '@/data/types';
import { urls } from '@/routes/routes.constant';
import OdsLinkSubstitution from '../authLink/AuthLink.component';

export default function NotificationContactStatus({
  contacts,
  notificationId,
}: {
  contacts: Contact[];
  notificationId: string;
}) {
  const { t } = useTranslation('communications');

  const affectedContact = useMemo(
    () =>
      contacts.find(
        (contact) =>
          contact.error != null ||
          contact.status === 'BOUNCED',
      ),
    [contacts],
  );

  if (!affectedContact) {
    return null;
  }

  return (
    <>
      <OdsIcon
        name={ODS_ICON_NAME.triangleExclamation}
        className="text-[1.7rem] cursor-pointer text-[var(--ods-color-warning-500)]"
        id={`${notificationId}-contact-status`}
      />
      <OdsPopover triggerId={`${notificationId}-contact-status`}>
        <OdsText
          className="select-none max-w-[300px]"
          preset={ODS_TEXT_PRESET.paragraph}
        >
          <Trans
            i18nKey="contact_status_warning"
            t={t}
            values={{
              contactType: affectedContact.type,
            }}
            components={{
              anchor: (
                <OdsLinkSubstitution
                  href={urls.contact.listing}
                ></OdsLinkSubstitution>
              ),
            }}
          />
        </OdsText>
      </OdsPopover>
    </>
  );
}
