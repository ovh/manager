import { Trans, useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Icon, Popover, PopoverContent, PopoverTrigger, TEXT_PRESET, Text, Link } from '@ovhcloud/ods-react';
import { Link as RouterLink } from 'react-router-dom';
import { Contact } from '@/data/types';
import { urls } from '@/routes/routes.constant';

type NotificationContactStatusProps = {
  contacts: Contact[];
};
export default function NotificationContactStatus({
  contacts,
}: NotificationContactStatusProps) {
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
    <Popover>
      <PopoverTrigger asChild>
        <Icon
          name="triangle-exclamation"
          className="text-[1.7rem] cursor-pointer text-[var(--ods-color-warning-500)]"
        />
      </PopoverTrigger>
      <PopoverContent withArrow createPortal>
        <Text
          className="select-none max-w-[300px]"
          preset={TEXT_PRESET.paragraph}
        >
          <Trans
            i18nKey="contact_status_warning"
            t={t}
            values={{
              contactType: affectedContact.type,
            }}
            components={{
              anchor: (
                <Link
                  as={RouterLink}
                  to={urls.contact.listing}
                ></Link>
              ),
            }}
          />
        </Text>
      </PopoverContent>
    </Popover>
  );
}
