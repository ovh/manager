import { AccordionItem } from '@radix-ui/react-accordion';
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

const Settings = () => {
  const { service } = useServiceData();

  return (
    <>
      <h3>Settings</h3>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2">
        <Card>
          <CardHeader>
            <h5>Upgrade your service</h5>
          </CardHeader>
          <CardContent>
            <UpdateTable />
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <h5>Manage ips</h5>
          </CardHeader>
          <CardContent>
            <IpsRestrictionsUpdate initialValue={service.ipRestrictions} />
          </CardContent>
        </Card>

        <Card className="col-span-2" id="maintenances">
          <CardHeader>
            <h5>Maintenances</h5>
          </CardHeader>
          <CardContent>
            <Maintenances />
          </CardContent>
        </Card>

        <Card className="col-span-1" id="configuration">
          <CardHeader>
            <h5>Configure your service</h5>
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
                    <h5>Advanced configuration</h5>
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
