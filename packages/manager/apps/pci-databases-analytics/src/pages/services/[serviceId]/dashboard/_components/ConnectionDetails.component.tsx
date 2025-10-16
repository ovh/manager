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
import { useGetCertificate } from '@/hooks/api/database/certificate/useGetCertificate.hook';

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
      <dl
        data-testid="connection-details-container"
        className="
            grid gap-x-2 gap-y-1 items-center text-sm
            grid-cols-1
            sm:grid-cols-[max-content_1fr]
          "
      >
        {selectedEndpoint?.domain && (
          <>
            <dt className="font-semibold whitespace-nowrap">
              {t('connectionDetailsTableHeaderHost')}
            </dt>
            <dd className="min-w-0">
              <Clipboard value={selectedEndpoint.domain} />
            </dd>
          </>
        )}

        {selectedEndpoint?.port > 0 && (
          <>
            <dt className="font-semibold whitespace-nowrap">
              {t('connectionDetailsTableHeaderPort')}
            </dt>
            <dd>
              <Clipboard value={`${selectedEndpoint.port}`} />
            </dd>
          </>
        )}

        {selectedEndpoint?.scheme && (
          <>
            <dt className="font-semibold whitespace-nowrap">
              {t('connectionDetailsTableHeaderScheme')}
            </dt>
            <dd>
              <Clipboard value={selectedEndpoint.scheme} />
            </dd>
          </>
        )}

        {selectedEndpoint?.sslMode && (
          <>
            <dt className="font-semibold whitespace-nowrap">
              {t('connectionDetailsTableHeaderSSLMode')}
            </dt>
            <dd>
              <Clipboard value={selectedEndpoint.sslMode} />
            </dd>
          </>
        )}

        {selectedEndpoint?.uri && (
          <>
            <dt className="font-semibold whitespace-nowrap">
              {t('connectionDetailsTableHeaderURI')}
            </dt>
            <dd className="min-w-0">
              <Clipboard value={selectedEndpoint.uri} />
            </dd>
          </>
        )}

        {certificateQuery.isSuccess && certificateQuery?.data?.ca && (
          <>
            <dt className="font-semibold whitespace-nowrap">
              {t('connectionDetailsCertificateLabel')}
            </dt>
            <dd className="min-w-0">
              <Clipboard
                value={certificateQuery.data.ca}
                secret
                showDownloadButton
              />
            </dd>
          </>
        )}
      </dl>
    </div>
  );
};

export default ConnectionDetails;
