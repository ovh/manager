import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Clipboard,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { useGetCertificate } from '@/data/hooks/database/certificate/useGetCertificate.hook';

interface ConnectionDetailsProps {
  endpoints: database.service.Endpoint[];
}

const ConnectionDetails = ({ endpoints }: ConnectionDetailsProps) => {
  const { service, projectId } = useServiceData();

  const certificateQuery = useGetCertificate(
    projectId,
    service.engine,
    service.id,
    {
      enabled:
        service.capabilities.certificates?.read ===
        database.service.capability.StateEnum.enabled,
    },
  );

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    database.service.Endpoint
  >(endpoints[0]);
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/dashboard',
  );
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
      {selectedEndpoint?.domain && (
        <div>
          <p className="font-semibold">
            {t('connectionDetailsTableHeaderHost')}
          </p>
          <Clipboard
            value={`${selectedEndpoint.domain}`}
            data-testid="dashboard-connection-detail-domain-button"
          />
        </div>
      )}
      {selectedEndpoint?.port > 0 && (
        <div className="my-2">
          <p className="font-semibold">
            {t('connectionDetailsTableHeaderPort')}
          </p>
          <Clipboard value={`${selectedEndpoint.port}`} />
        </div>
      )}

      {selectedEndpoint?.scheme && (
        <div className="my-2">
          <p className="font-semibold">
            {t('connectionDetailsTableHeaderScheme')}
          </p>
          <Clipboard value={`${selectedEndpoint.scheme}`} />
        </div>
      )}

      {selectedEndpoint?.sslMode && (
        <div className="my-2">
          <p className="font-semibold">
            {t('connectionDetailsTableHeaderSSLMode')}
          </p>
          <Clipboard value={`${selectedEndpoint.sslMode}`} />
        </div>
      )}

      {selectedEndpoint?.uri && (
        <div>
          <p className="font-semibold">
            {t('connectionDetailsTableHeaderURI')}
          </p>
          <Clipboard
            value={`${selectedEndpoint.uri}`}
            data-testid="dashboard-connection-detail-uri-button"
          />
        </div>
      )}

      {certificateQuery.isSuccess && certificateQuery?.data?.ca && (
        <div>
          <p className="font-semibold">
            {t('connectionDetailsCertificateLabel')}
          </p>
          <Clipboard
            value={`${certificateQuery.data.ca}`}
            secret
            showDownloadButton
          />
        </div>
      )}
    </div>
  );
};

export default ConnectionDetails;
