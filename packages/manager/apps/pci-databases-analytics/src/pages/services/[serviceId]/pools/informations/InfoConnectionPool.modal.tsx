import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Download, Files } from 'lucide-react';
import { useEffect } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  useToast,
} from '@datatr-ux/uxlib';
import useDownload from '@/hooks/useDownload';

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
  const toast = useToast();
  const { download } = useDownload();

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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle data-testid="info-pools-modal">
            {t('infoConnectionPoolTitle')}
          </DialogTitle>
        </DialogHeader>
        {certificateQuery.isSuccess ? (
          <div className="mt-4">
            <Table data-testid="info-pools-table">
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolDatabaseLabel')}
                  </TableCell>
                  <TableCell>{poolDb?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolPortLabel')}
                  </TableCell>
                  <TableCell>{connectionPool?.port}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolSslLabel')}
                  </TableCell>
                  <TableCell>{connectionPool?.sslMode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolCertificateLabel')}
                  </TableCell>
                  <TableCell>
                    <p
                      className="flex-1 truncate h-6 max-w-[320px]"
                      title={certificateQuery.data?.ca}
                    >
                      {certificateQuery.data?.ca}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-1">
                      <Button
                        data-testid="info-pools-copy-certificate-action"
                        type="button"
                        className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            certificateQuery.data?.ca,
                          );
                          toast.toast({
                            title: t('infoConnectionPoolCertificateCopyToast'),
                          });
                        }}
                      >
                        <Files className="w-4 h-4" />
                      </Button>
                      <Button
                        data-testid="info-pools-download-ca-action"
                        type="button"
                        className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
                        onClick={() => {
                          download(certificateQuery.data?.ca, 'ca.pem');
                          toast.toast({
                            title: t(
                              'infoConnectionPoolCertificateDownloadToast',
                            ),
                          });
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolUriLabel')}
                  </TableCell>
                  <TableCell>
                    <p
                      className="flex-1 truncate h-6 max-w-[320px]"
                      title={connectionPool?.uri}
                    >
                      {connectionPool?.uri}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Button
                        data-testid="info-pools-copy-uri-action"
                        type="button"
                        className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
                        onClick={() => {
                          navigator.clipboard.writeText(connectionPool?.uri);
                          toast.toast({
                            title: t('infoConnectionPoolUriToast'),
                          });
                        }}
                      >
                        <Files className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolModeLabel')}
                  </TableCell>
                  <TableCell>{connectionPool?.mode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolSizeLabel')}
                  </TableCell>
                  <TableCell>{connectionPool?.size}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>{t('infoConnectionPoolLoading')}</p>
        )}
      </DialogContent>
    </RouteModal>
  );
};

export default InfoConnectionPool;
