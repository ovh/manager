import {
  Badge,
  BADGE_COLOR,
  BADGE_SIZE,
  Icon,
  Radio,
  RadioControl,
  Text,
} from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlavorsTable,
  FlavorTr,
  TableColumn,
  TableRow,
} from '@/components/flavorsTable/FlavorsTable.component';
import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';

const FlavorBlock: FC = () => {
  const { t } = useTranslation('creation');

  const columns: TableColumn[] = [
    { key: 'action', label: undefined },
    { key: 'name', label: <Text>Name</Text> },
    {
      key: 'memory',
      label: (
        <Text>
          Memory <Text className="font-normal">(Go)</Text>
        </Text>
      ),
    },
    { key: 'vcore', label: <Text>vCore</Text> },
    {
      key: 'storage',
      label: (
        <Text>
          Stockage <Text className="font-normal">(Go)</Text>
        </Text>
      ),
    },
    { key: 'mode', label: <Text>Deploiement</Text> },
    {
      key: 'priceHour',
      label: (
        <Text>
          Prix <Text className="font-normal">HT/heure</Text>
        </Text>
      ),
    },
    {
      key: 'priceMonth',
      label: (
        <Text>
          Prix <Text className="font-normal">HT/mois</Text>
        </Text>
      ),
    },
  ];

  const rows: TableRow[] = [
    {
      name: 'b3-8',
      unavailable: false,
      memory: '8',
      vcore: '2',
      storage: '50NVMe',
      mode: 'region-3-az',
      priceHour: '0,0465 €',
      priceMonth: '25,50 €',
    },
    {
      name: 'b3-16',
      unavailable: false,
      memory: '16',
      vcore: '4',
      storage: '100NVMe',
      mode: 'region-3-az',
      priceHour: '0,186 €',
      priceMonth: '51,00 €',
    },
    {
      name: 'b3-32',
      unavailable: true,
      memory: '32',
      vcore: '8',
      storage: '200NVMe',
      mode: 'region-3-az',
      priceHour: '0,372 €',
      priceMonth: '102,00 €',
    },
    {
      name: 'b3-256',
      unavailable: false,
      memory: '256',
      vcore: '128',
      storage: '400NVMe',
      mode: 'region-3-az',
      priceHour: '2,9756 €',
      priceMonth: '816,00 €',
    },
    {
      name: 'b3-512',
      unavailable: false,
      memory: '512',
      vcore: '160',
      storage: '400NVMe',
      mode: 'region-3-az',
      priceHour: '3,7195 €',
      priceMonth: '1632,00 €',
    },
  ];

  return (
    <section className="mt-8">
      <FlavorsTable<TableRow>
        columns={columns}
        rows={rows}
        caption={t('pci_instance_creation_select_flavor_title')}
        selectable
        onClick={() => console.log('clicked !')}
        TrChildren={FlavorTr}
      />
    </section>
  );
};

export default FlavorBlock;
