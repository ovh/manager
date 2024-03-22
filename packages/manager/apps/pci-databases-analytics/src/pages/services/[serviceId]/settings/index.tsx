import IpsRestrictionsForm from '@/components/Order/cluster-options/ips-restrictions-form';
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

const Settings = () => {
  const { service, projectId } = useServiceData();
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
            <h4>Upgrade your service</h4>
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
                    <TableCell>
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
                    <TableCell>
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
                    <TableCell>
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
                {service.storage && (
                  <TableRow>
                    <TableCell className="font-semibold">Storage</TableCell>
                    <TableCell>
                      {formatStorage(service.storage.size)}{' '}
                      {service.storage.type}
                    </TableCell>
                    {availabilitiesFlavorQuery.data?.length > 1 && (
                      <TableCell>
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
                    <TableCell>
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
            <h4>Manage ips</h4>
          </CardHeader>
          <CardContent>
            <IpsRestrictionsForm
              value={service.ipRestrictions}
              onChange={(newIps) => {}}
            ></IpsRestrictionsForm>
          </CardContent>
        </Card>

        <Card className="col-span-2" id="maintenances">
          <CardHeader>
            <h4>Maintenances</h4>
          </CardHeader>
          <CardContent>
            <Maintenances />
          </CardContent>
        </Card>

        <Card className="col-span-1" id="configuration">
          <CardHeader>
            <h4>Configure your service</h4>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" className="w-full">
                Rename my service
              </Button>
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
              <Button variant="destructive" className="w-full">
                Delete my service
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <h4>Advanced configuration</h4>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              <li className="list-item">
                display current advanced configuration
              </li>
              <li className="list-item">update advanced configuration</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Settings;
