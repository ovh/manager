import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { Link, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useNichandle } from '@/hooks/nichandle/useNichandle';

interface UpdateMeComponentProps {
  readonly argumentKey: string;
  readonly value: string;
  readonly fields: string[];
}

export default function UpdateMeComponent({
  argumentKey,
  value,
  fields,
}: UpdateMeComponentProps) {
  const { t } = useTranslation('dashboard');
  const { data: accountUrl } = useNavigationGetUrl(['account', '', {}]);
  const { nichandle } = useNichandle();

  const url = `${accountUrl as string}/useraccount/infos`;

  if (nichandle !== value) {
    return (
      <Text preset={TEXT_PRESET.paragraph} className="mb-2">
        {t(`domain_operations_update_contact_not_me`, {
          t0: argumentKey,
          t1: value,
        })}
      </Text>
    );
  }

  return (
    <>
      <Text preset={TEXT_PRESET.paragraph} className="mb-2">
        {t('domain_operations_update_me_fields', {
          t0: fields.join(', '),
        })}
      </Text>
      <Link
        href={url}
        color="primary"
        className="block modal-link"
        icon="external-link"
        isDisabled={!url}
      >
        {t(`domain_operations_update_${argumentKey}_click`)}
      </Link>
    </>
  );
}
