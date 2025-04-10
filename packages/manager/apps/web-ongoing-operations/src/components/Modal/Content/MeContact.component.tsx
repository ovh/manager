import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { getNicParams } from '@/utils/utils';
import { domainCreate, domainIncomingTransfert } from '@/constants';

interface MeContactComponentProps {
  readonly argumentKey: string;
  readonly value: string;
  readonly domainName: string;
  readonly operationName: string;
  readonly fields: string[];
}

export default function MeContactComponent({
  argumentKey,
  value,
  domainName,
  operationName,
  fields,
}: MeContactComponentProps) {
  const { t } = useTranslation('dashboard');
  const { data: webUrl } = useNavigationGetUrl(['web', '', {}]);
  const { data: dedicatedUrl } = useNavigationGetUrl(['dedicated', '', {}]);

  let url = `${webUrl}/domain/${domainName}/contact-management/edit-contact/${value}/`;
  if ([domainIncomingTransfert, domainCreate].includes(operationName)) {
    url = `${dedicatedUrl}/contact/${value}/${
      fields.length ? getNicParams(fields) : ''
    }`;
  }

  return (
    <OdsLink
      href={url}
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
