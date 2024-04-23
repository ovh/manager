import { AccordionItem } from '@radix-ui/react-accordion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useServiceData } from '../layout';
import Maintenances from './_components/maintenances';
import IpsRestrictionsUpdate from './_components/ipRestrictions';
import AdvancedConfigurationUpdate from './_components/advancedConfiguration';
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import UpdateTable from './_components/updateTable';
import ServiceConfiguration from './_components/serviceConfiguration';
import Guides from '@/components/guides';
import { GuideSections } from '@/models/guide';

const Settings = () => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings',
  );

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.settings} engine={service.engine} />
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2" id="update">
        <Card>
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

        <Card className="col-span-2" id="maintenances">
          <CardHeader>
            <h5>{t('maintenancesTitle')}</h5>
          </CardHeader>
          <CardContent>
            <Maintenances />
          </CardContent>
        </Card>

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
                  <AccordionTrigger>
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
    </>
  );
};

export default Settings;
