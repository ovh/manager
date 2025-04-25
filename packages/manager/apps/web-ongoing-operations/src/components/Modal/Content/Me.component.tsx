import React from 'react';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useNichandle } from '@/hooks/nichandle/useNichandle';

interface MeComponentProps {
  readonly argumentKey: string;
  readonly value: string;
  readonly fields: string[];
}

export default function MeComponent({
  argumentKey,
  value,
  fields,
}: MeComponentProps) {
  const { t } = useTranslation('dashboard');
  const { data: url } = useNavigationGetUrl(['new-account', '', {}]);
  const { nichandle } = useNichandle();

  if (nichandle !== value) {
    return (
      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-2">
        {t(`domain_operations_update_contact_not_me`, {
          t0: argumentKey,
          t1: value,
        })}
      </OdsText>
    );
  }

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-2">
        {t('domain_operations_update_me_fields', {
          t0: fields.join(', '),
        })}
      </OdsText>
      <OdsLink
        href={`${url}/useraccount/infos`}
        color="primary"
        label={t(`domain_operations_update_${argumentKey}_click`)}
        className="block modal-link"
        target="_blank"
        icon="external-link"
        isDisabled={!url}
      />
    </>
  );
}
