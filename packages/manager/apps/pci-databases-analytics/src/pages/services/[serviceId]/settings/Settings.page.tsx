import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@datatr-ux/uxlib';
import { useServiceData } from '../Service.context';
import Maintenances from './_components/Maintenances.component';
import IpsRestrictionsUpdate from './_components/IpRestrictionsUpdate.component';
import AdvancedConfigurationUpdate from './_components/AdvancedConfigurationUpdate.component';
import UpdateTable from './_components/UpdateTable.component';
import ServiceConfiguration from './_components/ServiceConfiguration.component';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import { cn } from '@/lib/utils';
import KafkaSettingsTile from './_components/KafkaSettingsTile.component';

const Settings = () => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings',
  );
  const hasKafkaSettingsTile =
    service.capabilities.restApi || service.capabilities.schemaRegistry;
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.settings} engine={service.engine} />
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2" id="update">
        <Card data-testid="update-table-card">
          <CardHeader>
            <h5>{t('updateTitle')}</h5>
          </CardHeader>
          <CardContent>
            <UpdateTable />
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <h5>{t('ipsTitle')}</h5>
          </CardHeader>
          <CardContent>
            <IpsRestrictionsUpdate initialValue={service.ipRestrictions} />
          </CardContent>
        </Card>

        <Card
          className={cn('col-span-2', hasKafkaSettingsTile && 'col-span-1')}
          id="maintenances"
        >
          <CardHeader>
            <h5>{t('maintenancesTitle')}</h5>
          </CardHeader>
          <CardContent>
            <Maintenances />
          </CardContent>
        </Card>
        {hasKafkaSettingsTile && (
          <Card id="kafka-configuration" className="col-span-1">
            <CardHeader>
              <h5>{t('Kafka')}</h5>
            </CardHeader>
            <CardContent>
              <KafkaSettingsTile />
            </CardContent>
          </Card>
        )}
        <Card className="col-span-1" id="configuration">
          <CardHeader>
            <h5>{t('serviceConfigurationTitle')}</h5>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <ServiceConfiguration />
          </CardContent>
        </Card>
        {service.capabilities.advancedConfiguration && (
          <Card className="col-span-3">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advancedConfiguration">
                <CardHeader>
                  <AccordionTrigger data-testid="advanced-config-accordion-trigger">
                    <h5>{t('advancedConfigurationTitle')}</h5>
                  </AccordionTrigger>
                </CardHeader>
                <CardContent>
                  <AccordionContent>
                    <AdvancedConfigurationUpdate />
                  </AccordionContent>
                </CardContent>
              </AccordionItem>
            </Accordion>
          </Card>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default Settings;
