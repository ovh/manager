import { useState } from 'react';
import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import * as database from '@/types/cloud/project/database';
import { useToast } from '@/components/ui/use-toast';

interface ConnectionDetailsProps {
  endpoints: database.service.Endpoint[];
}

const ConnectionDetails = ({ endpoints }: ConnectionDetailsProps) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    database.service.Endpoint
  >(endpoints[0]);
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/dashboard',
  );
  const toast = useToast();
  return (
    <div data-testid="connection-details-container">
      {endpoints.length > 1 && (
        <Select
          value={selectedEndpoint.component}
          onValueChange={(v) =>
            setSelectedEndpoint(
              endpoints.find((endpoint) => endpoint.component === v),
            )
          }
        >
          <SelectTrigger
            data-testid="dashboard-connection-detail-select"
            className="h-8 mb-3"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {endpoints.map((ep) => (
              <SelectItem key={ep.component} value={ep.component}>
                {ep.component}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Table>
        <TableBody>
          {selectedEndpoint?.domain && (
            <TableRow>
              <TableCell className="font-semibold">
                {t('connectionDetailsTableHeaderHost')}
              </TableCell>
              <TableCell>
                <p
                  className="flex-1 truncate h-6 max-w-[300px] m-0"
                  title={selectedEndpoint.domain}
                >
                  {selectedEndpoint.domain}
                </p>
              </TableCell>
              <TableCell>
                <Button
                  data-testid="dashboard-connection-detail-domain-button"
                  type="button"
                  size="table"
                  variant="table"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedEndpoint.domain);
                    toast.toast({
                      title: t('connectionDetailsHostCopyToast'),
                    });
                  }}
                >
                  <Files className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          )}
          {selectedEndpoint?.port && (
            <TableRow>
              <TableCell className="font-semibold">
                {t('connectionDetailsTableHeaderPort')}
              </TableCell>
              <TableCell>{selectedEndpoint.port}</TableCell>
            </TableRow>
          )}
          {selectedEndpoint?.scheme && (
            <TableRow>
              <TableCell className="font-semibold">
                {t('connectionDetailsTableHeaderScheme')}
              </TableCell>
              <TableCell>{selectedEndpoint.scheme}</TableCell>
            </TableRow>
          )}
          {selectedEndpoint?.sslMode && (
            <TableRow>
              <TableCell className="font-semibold">
                {t('connectionDetailsTableHeaderSSLMode')}
              </TableCell>
              <TableCell>{t('connectionDetailsTableSSLMode')}</TableCell>
            </TableRow>
          )}
          {selectedEndpoint?.uri && (
            <TableRow>
              <TableCell className="font-semibold">
                {t('connectionDetailsTableHeaderURI')}
              </TableCell>
              <TableCell>
                <p
                  className="flex-1 truncate h-6 max-w-[300px]"
                  title={selectedEndpoint.uri}
                >
                  {selectedEndpoint.uri}
                </p>
              </TableCell>
              <TableCell>
                <Button
                  data-testid="dashboard-connection-detail-uri-button"
                  type="button"
                  size="table"
                  variant="table"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedEndpoint.uri);
                    toast.toast({
                      title: t('connectionDetailsURICopyToast'),
                    });
                  }}
                >
                  <Files className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ConnectionDetails;
