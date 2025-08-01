import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { getNicParams } from '@/utils/utils';
import { DomainOperationsEnum } from '@/constants';
import { useNichandle } from '@/hooks/nichandle/useNichandle';
import { useGetDomainInformation } from '@/hooks/data/query';
import Loading from '@/components/Loading/Loading';

interface ActionMeContactComponentProps {
  readonly argumentKey: string;
  readonly value: string;
  readonly domainName: string;
  readonly operationName: string;
  readonly fields: string[];
}

export default function ActionMeContactComponent({
  argumentKey,
  value,
  domainName,
  operationName,
  fields,
}: ActionMeContactComponentProps) {
  const { t } = useTranslation('dashboard');
  const { data: webUrl } = useNavigationGetUrl(['web', '', {}]);
  const { data: accountUrl } = useNavigationGetUrl(['account', '', {}]);
  const { nichandle } = useNichandle();
  const { data: serviceInfo, isLoading } = useGetDomainInformation(domainName);

  if (isLoading) {
    return <Loading />;
  }

  if (serviceInfo && nichandle !== serviceInfo.contactAdmin.id) {
    return (
      <OdsText>{t('domain_operations_update_contact_administrator')}</OdsText>
    );
  }

  let url = `${webUrl}/domain/${domainName}/contact-management/edit-contact/${value}/`;
  if (
    [
      DomainOperationsEnum.DomainIncomingTransfer,
      DomainOperationsEnum.DomainCreate,
    ].includes(operationName as DomainOperationsEnum)
  ) {
    url = `${accountUrl}/contact/${value}/${
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
      icon="external-link"
      data-testid="contactupdate"
      isDisabled={!url}
    />
  );
}
