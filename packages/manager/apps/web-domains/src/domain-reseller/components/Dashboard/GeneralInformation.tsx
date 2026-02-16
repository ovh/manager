import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface GeneralInformationProps {
  domainsLength: number;
}

export default function GeneralInformation({
  domainsLength,
}: GeneralInformationProps) {
  const { t } = useTranslation(['domain-reseller', NAMESPACES.DASHBOARD]);
  return (
    <ManagerTile>
      <ManagerTile.Title>
        {t(`${NAMESPACES.DASHBOARD}:general_information`)}
      </ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('domain_reseller_general_informations_label')}
        </ManagerTile.Item.Label>
        <Text>
          {domainsLength === 0
            ? t('domain_reseller_general_informations_no_domains')
            : t('domain_reseller_general_informations_domains_length', {
                length: domainsLength,
              })}
        </Text>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
