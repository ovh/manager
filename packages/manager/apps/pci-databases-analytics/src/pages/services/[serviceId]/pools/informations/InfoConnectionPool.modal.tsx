import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Clipboard,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  DialogFooter,
  DialogClose,
  DialogBody,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useGetCertificate } from '@/hooks/api/database/certificate/useGetCertificate.hook';
import { useServiceData } from '../../Service.context';
import { useGetConnectionPools } from '@/hooks/api/database/connectionPool/useGetConnectionPools.hook';
import { useGetDatabases } from '@/hooks/api/database/database/useGetDatabases.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const InfoConnectionPool = () => {
  const { projectId, poolId } = useParams();
  const navigate = useNavigate();
  const { service } = useServiceData();
  const connectionPoolsQuery = useGetConnectionPools(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const connectionPools = connectionPoolsQuery.data;
  const connectionPool = connectionPools?.find((c) => c.id === poolId);
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );

  const certificateQuery = useGetCertificate(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const databasesQuery = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const databases = databasesQuery.data;

  useEffect(() => {
    if (connectionPools && !connectionPool) navigate('../');
  }, [connectionPools, connectionPool]);

  const poolDb: database.service.Database = databases?.find(
    (db) => db.id === connectionPool?.databaseId,
  );

  return (
    <RouteModal
      isLoading={!poolDb || !connectionPool || !certificateQuery.data}
    >
      <DialogContent className="sm:max-w-xl" variant="information">
        <DialogHeader>
          <DialogTitle data-testid="info-pools-modal">
            {t('infoConnectionPoolTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {certificateQuery.isSuccess && (
            <div data-testid="info-pools-container">
              <p className="font-semibold">
                {t('infoConnectionPoolDatabaseLabel')}
              </p>
              <Clipboard value={`${poolDb?.name}`} />

              <p className="font-semibold">
                {t('infoConnectionPoolPortLabel')}
              </p>
              <Clipboard value={`${connectionPool?.port}`} />

              <p className="font-semibold">{t('infoConnectionPoolSslLabel')}</p>
              <Clipboard value={`${connectionPool?.sslMode}`} />

              <p className="font-semibold">
                {t('infoConnectionPoolCertificateLabel')}
              </p>
              <Clipboard
                value={`${certificateQuery.data?.ca}`}
                secret
                showDownloadButton
                className="break-words"
              />

              <p className="font-semibold">{t('infoConnectionPoolUriLabel')}</p>
              <Clipboard
                value={`${connectionPool?.uri}`}
                secret
                showDownloadButton
                className="break-words"
              />

              <p className="font-semibold">
                {t('infoConnectionPoolModeLabel')}
              </p>
              <Clipboard value={`${connectionPool?.mode}`} />
              <p className="font-semibold">
                {t('infoConnectionPoolSizeLabel')}
              </p>
              <Clipboard value={`${connectionPool?.size}`} />
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              data-testid="delete-pools-close-button"
              type="button"
              mode="ghost"
            >
              {t('infoConnectionPoolButtonClose')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default InfoConnectionPool;
