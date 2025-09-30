import { Badge, BADGE_COLOR, BADGE_SIZE, Icon, Radio, RadioControl, Text } from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FlavorsTable, TableColumn, TableRow } from "@/components/flavorsTable/FlavorsTable.component";
import { DeploymentModeBadge } from "@/components/deploymentModeBadge/DeploymentModeBadge.component";

const FlavorBlock: FC = () => {
  const { t } = useTranslation('creation');

  const columns: TableColumn[] = [
    { key: "action", label: undefined },
    { key: "name", label: <Text>Name</Text> },
    { key: "memory", label: <Text>Memory <Text className="font-normal">(Go)</Text></Text> },
    { key: "vcore", label: <Text>vCore</Text> },
    { key: "storage", label: <Text>Stockage <Text className="font-normal">(Go)</Text></Text> },
    { key: "mode", label: <Text>Deploiement</Text> },
    { key: "priceHour", label: <Text>Prix <Text className="font-normal">HT/heure</Text></Text> },
    { key: "priceMonth", label: <Text>Prix <Text className="font-normal">HT/mois</Text></Text> },
  ];

  const rows: TableRow[]= [
    {
      id: "b3-8",
      unavailable: false,
      action: <Radio value="b3-8" className={"w-full"}><RadioControl /></Radio>,
      name:<Text className={"font-normal"}>b3-8</Text>,
      memory: <Text>8</Text>,
      vcore: <Text>2</Text>,
      storage: <Text>50NVMe</Text>,
      mode: <DeploymentModeBadge mode="region-3-az" size={BADGE_SIZE.sm} />,
      priceHour: <Text className={"font-semibold"}>0,0465 €</Text>,
      priceMonth: <Text className={"font-semibold"}>25,50 €</Text>,
    },
    {
      id: "b3-16",
      unavailable: false,
      action: <Radio value="b3-16" className={"w-full"}><RadioControl /></Radio>,
      name:<Text className={"font-normal"}>b3-16</Text>,
      memory: <Text>16</Text>,
      vcore: <Text>4</Text>,
      storage: <Text>100NVMe</Text>,
      mode: <DeploymentModeBadge mode="region-3-az" size={BADGE_SIZE.sm} />,
      priceHour: <Text className={"font-semibold"}>0,186 €</Text>,
      priceMonth: <Text className={"font-semibold"}>51,00 €</Text>,
    },
    {
      id: "b3-32",
      unavailable: true,
      action: <Radio value="b3-32" className={"w-full"}><RadioControl /></Radio>,
      name:<Text className={"font-normal"}>b3-32</Text>,
      memory: <Text>32</Text>,
      vcore: <Text>8</Text>,
      storage: <Text>200NVMe</Text>,
      mode: <DeploymentModeBadge mode="region-3-az" size={BADGE_SIZE.sm} />,
      priceHour: <Text className={"font-semibold"}>0,372 €</Text>,
      priceMonth: <Text className={"font-semibold"}>102,00 €</Text>,
    },
    {
      id: "b3-256",
      unavailable: false,
      action: <Radio value="b3-256" className={"w-full"}><RadioControl /></Radio>,
      name: <div className="flex flex-row gap-4 w-full h-full flex-wrap items-center content-start">
        <Text className={"font-normal"}>b3-256</Text><Badge size={BADGE_SIZE.sm} color={BADGE_COLOR.warning} className="h-fit text-wrap font-normal">Quota indisponible
        <Icon aria-label="Info" name="circle-info" role="img"/>
      </Badge>
      </div>,
      memory: <Text>256</Text>,
      vcore: <Text>128</Text>,
      storage: <Text>400NVMe</Text>,
      mode: <DeploymentModeBadge mode="region-3-az" size={BADGE_SIZE.sm} />,
      priceHour: <Text className={"font-semibold"}>2,9756 €</Text>,
      priceMonth: <Text className={"font-semibold"}>816,00 €</Text>,
    },
    {
      id: "b3-512",
      unavailable: false,
      action: <Radio value="b3-512" className={"w-full"}><RadioControl /></Radio>,
      name: <div className="flex flex-row gap-4 w-full h-full flex-wrap items-center content-start">
        <Text className={"font-normal"}>b3-512</Text><Badge size={BADGE_SIZE.sm} color={BADGE_COLOR.warning} className="h-fit text-wrap font-normal">Indisponible
        <Icon aria-label="Info" name="circle-info" role="img"/>
      </Badge>
      </div>,
      memory: <Text>512</Text>,
      vcore: <Text>160</Text>,
      storage: <Text>400NVMe</Text>,
      mode: <DeploymentModeBadge mode="region-3-az" size={BADGE_SIZE.sm} />,
      priceHour: <Text className={"font-semibold"}>3,7195 €</Text>,
      priceMonth: <Text className={"font-semibold"}>1632,00 €</Text>,
    }
  ]

  return (
    <section className="mt-8">
      <FlavorsTable columns={columns} rows={rows} caption={t('pci_instance_creation_select_flavor_title')} selectable onClick={() => console.log('clicked !')}></FlavorsTable>
    </section>
  );
};

export default FlavorBlock;
