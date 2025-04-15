import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

interface MeContactComponentProps {
  readonly argumentKey: string;
  readonly value: string;
  readonly domainName: string;
}

export default function MeContactComponent({
  argumentKey,
  value,
  domainName,
}: MeContactComponentProps) {
  const { t } = useTranslation('dashboard');
  const { data: url } = useNavigationGetUrl(['web', '', {}]);

  return (
    <OdsLink
      href={`${url as string}/domain/${domainName}/contact-management/edit-contact/${value}/`}
      color="primary"
      label={t(
        `domain_operations_update_nicowner_click_${
          argumentKey === 'corporationProof' ? 'nicowner' : argumentKey ?? ''
        }`,
      )}
      className="block"
      target="_blank"
      icon="external-link"
      data-testid="contactModal"
      isDisabled={!url}
    />
  );
}
