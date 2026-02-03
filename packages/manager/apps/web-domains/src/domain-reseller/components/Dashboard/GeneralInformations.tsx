import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface GeneralInformationsProps {
  domainsLength: number;
}

export default function GeneralInformations({
  domainsLength,
}: GeneralInformationsProps) {
  const { t } = useTranslation(['domain-reseller', NAMESPACES.DASHBOARD]);
  return (
    <ManagerTile className="h-fit">
      <ManagerTile.Title>
        {t(`${NAMESPACES.DASHBOARD}:general_information`)}
      </ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('domain_reseller_general_informations_label')}
        </ManagerTile.Item.Label>
        <Text>
          {t('domain_reseller_general_informations_domains_length', {
            length: domainsLength,
          })}
        </Text>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
