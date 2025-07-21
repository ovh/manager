import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsIcon, OdsPopover, OdsText } from '@ovhcloud/ods-components/react';
import { Trans, useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { clsx } from 'clsx';
import { Contact } from '@/data/types';
import { urls } from '@/routes/routes.constant';
import OdsLinkSubstitution from '../odsLinkSubsitution/OdsLinkSubstitution.component';

const STATUS_PRIORITY = {
  SENT: 0,
  QUEUED: 1,
  DROPPED: 2,
};

export default function NotificationContactStatus({
  contacts,
  notificationId,
}: {
  contacts: Contact[];
  notificationId: string;
}) {
  const { t } = useTranslation('communications');

  const highestPriorityContact = useMemo(
    () =>
      contacts.reduce((highest, current) => {
        if (
          !highest ||
          STATUS_PRIORITY[current.status] > STATUS_PRIORITY[highest.status]
        ) {
          return current;
        }
        return highest;
      }, null as Contact | null),
    [contacts],
  );

  if (!highestPriorityContact || highestPriorityContact.status === 'SENT') {
    return null;
  }

  const className = clsx(
    'text-[1.7rem] cursor-pointer',
    highestPriorityContact.status === 'DROPPED'
      ? 'text-[--ods-color-critical-500]'
      : 'text-[--ods-color-warning-500]',
  );

  return (
    <>
      <OdsIcon
        name={ODS_ICON_NAME.triangleExclamation}
        className={className}
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
              contactType: highestPriorityContact.type,
            }}
            components={{
              anchor: (
                <OdsLinkSubstitution
                  href={urls.ContactsTab}
                ></OdsLinkSubstitution>
              ),
            }}
          />
        </OdsText>
      </OdsPopover>
    </>
  );
}
