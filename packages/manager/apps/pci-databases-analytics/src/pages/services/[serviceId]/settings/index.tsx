import { AccordionItem } from '@radix-ui/react-accordion';
import { Link } from '@/components/links';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useServiceData } from '../layout';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { formatStorage } from '@/lib/bytesHelper';
import { useGetAvailabilities } from '@/hooks/api/availabilities.api.hooks';
import { database } from '@/models/database';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/ui/time-picker';
import { Label } from '@/components/ui/label';
import Maintenances from './_components/maintenances';
import IpsRestrictionsUpdate from './_components/ipRestrictions';
import RenameService from '../_components/renameService';
import { useModale } from '@/hooks/useModale';
import AdvancedConfigurationUpdate from './_components/advancedConfiguration';
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Settings = () => {
  const renameModale = useModale('rename');
  const { service, projectId, serviceQuery } = useServiceData();
  const availabilitiesVersionQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.version,
  );
  const availabilitiesPlanQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.plan,
  );
  const availabilitiesFlavorQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.flavor,
  );
  function convertTimeToDateTime(timeString: string): Date {
    // Create a new date object for the current date
    const now = new Date();

    // Split the time string into its components
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    // Set the time for the date object
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(seconds);

    // Return the modified date object
    return now;
  }
  return (
    <>
      <h3>Settings</h3>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2">
        <Card>
          <CardHeader>
            <h5>Upgrade your service</h5>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Version</TableCell>
                  <TableCell>
                    {humanizeEngine(service.engine)} {service.version}
                  </TableCell>
                  {availabilitiesVersionQuery.data?.length > 1 && (
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="py-0 h-auto"
                        asChild
                      >
                        <Link
                          className="hover:no-underline text-sm font-normal"
                          to={'update?target=version'}
                        >
                          Update
                        </Link>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Plan</TableCell>
                  <TableCell>{service.plan}</TableCell>
                  {availabilitiesPlanQuery.data?.length > 1 && (
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="py-0 h-auto"
                        asChild
                      >
                        <Link
                          className="hover:no-underline text-sm font-normal"
                          to={'update?target=plan'}
                        >
                          Update
                        </Link>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Flavor</TableCell>
                  <TableCell>{service.flavor}</TableCell>
                  {availabilitiesFlavorQuery.data?.length > 1 && (
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="py-0 h-auto"
                        asChild
                      >
                        <Link
                          className="hover:no-underline text-sm font-normal"
                          to={'update?target=flavor'}
                        >
                          Update
                        </Link>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
                {service.storage?.size.value > 0 && (
                  <TableRow>
                    <TableCell className="font-semibold">Storage</TableCell>
                    <TableCell>
                      {formatStorage(service.storage.size)}{' '}
                      {service.storage.type}
                    </TableCell>
                    {availabilitiesFlavorQuery.data?.length > 1 && (
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="py-0 h-auto"
                          asChild
                        >
                          <Link
                            className="hover:no-underline text-sm font-normal"
                            to={'update?target=flavor'}
                          >
                            Update
                          </Link>
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="font-semibold">Nodes</TableCell>
                  <TableCell>{service.nodes.length}</TableCell>
                  {availabilitiesFlavorQuery.data?.length > 1 && (
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="py-0 h-auto"
                        asChild
                      >
                        <Link
                          className="hover:no-underline text-sm font-normal"
                          to={'update?target=flavor'}
                        >
                          Update
                        </Link>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
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
          <CardContent>
            <div className="grid gap-2">
              <div>
                <Label>Maintenance time</Label>
                <TimePicker
                  date={convertTimeToDateTime(service.maintenanceTime)}
                  setDate={() => {}}
                />
              </div>
              <div>
                <Label>Backup time</Label>
                <TimePicker
                  date={convertTimeToDateTime(service.backups?.time)}
                  setDate={() => {}}
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => renameModale.open()}
              >
                Rename my service
              </Button>
              <Button variant="destructive" className="w-full">
                Delete my service
              </Button>
            </div>
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

      <RenameService
        controller={renameModale.controller}
        service={service}
        onSuccess={() => {
          renameModale.close();
          serviceQuery.refetch();
        }}
      />
    </>
  );
};

export default Settings;
