import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { database } from '@/models/database';
import { useServiceData } from '../../layout';
import { useGetAvailabilities } from '@/hooks/api/availabilities.api.hooks';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/links';
import { formatStorage } from '@/lib/bytesHelper';

const UpdateTable = () => {
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
  return (
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
                variant="default"
                size="default"
                className="py-0 h-auto"
                asChild
              >
                <Link
                  className="hover:no-underline hover:text-white text-sm font-semibold"
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
                variant="default"
                size="default"
                className="py-0 h-auto"
                asChild
              >
                <Link
                  className="hover:no-underline hover:text-white text-sm font-semibold"
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
                variant="default"
                size="default"
                className="py-0 h-auto"
                asChild
              >
                <Link
                  className="hover:no-underline hover:text-white text-sm font-semibold"
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
              {formatStorage(service.storage.size)} {service.storage.type}
            </TableCell>
            {availabilitiesFlavorQuery.data?.length > 1 && (
              <TableCell className="text-right">
                <Button
                  variant="default"
                  size="default"
                  className="py-0 h-auto"
                  asChild
                >
                  <Link
                    className="hover:no-underline hover:text-white text-sm font-semibold"
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
                variant="default"
                size="default"
                className="py-0 h-auto"
                asChild
              >
                <Link
                  className="hover:no-underline hover:text-white text-sm font-semibold"
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
  );
};

export default UpdateTable;
