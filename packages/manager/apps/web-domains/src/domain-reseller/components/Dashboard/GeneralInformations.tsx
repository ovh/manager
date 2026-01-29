import { ManagerTile } from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';

interface GeneralInformationsProps {
  domainsLength: number;
}

export default function GeneralInformations({
  domainsLength,
}: GeneralInformationsProps) {
  return (
    <ManagerTile>
      <ManagerTile.Title>Informations générales</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          Domaines enregistrés à tarifs préférentiels
        </ManagerTile.Item.Label>
        <Text>{domainsLength} domaines actifs</Text>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
