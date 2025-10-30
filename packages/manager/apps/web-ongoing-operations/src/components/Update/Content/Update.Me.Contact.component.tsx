import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { Link, Text } from '@ovhcloud/ods-react';
import { getNicParams } from '@/utils/utils';
import { ContactControlProperties, DomainOperationsEnum } from '@/constants';
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
    return <Text>{t('domain_operations_update_contact_administrator')}</Text>;
  }

  let url = `${webUrl as string}/domain/${domainName}/contact-management/edit-contact/${value}/`;
  if (
    [
      DomainOperationsEnum.DomainIncomingTransfer,
      DomainOperationsEnum.DomainCreate,
    ].includes(operationName as DomainOperationsEnum)
  ) {
    url = `${accountUrl as string}/contact/${value}/${
      fields.length ? getNicParams(fields) : ''
    }`;
  }

  return (
    <div>
      {ContactControlProperties.some((ccp) => fields.includes(ccp)) && (
        <div className="mb-8">
          <Text>{t('domain_operations_update_properties')}</Text>
          <ul className="m-0 p-0 pl-4">
            {fields.map((item) => (
              <li key={item} className="font-bold text-[var(--ods-color-text)]">
                {t(`domain_operations_update_${item}`)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link
        href={url}
        color="primary"
        className="block"
        icon="external-link"
        data-testid="contactupdate"
        disabled={!url}
      >
        {t(
          `domain_operations_update_nicowner_click_${
            argumentKey === 'corporationProof' ? 'nicowner' : argumentKey ?? ''
          }`,
        )}
      </Link>
    </div>
  );
}
