import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Download, Files } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { P } from '@/components/typography';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { ModalController } from '@/hooks/useModale';
import { useGetCertificate } from '@/hooks/api/certificates.api.hooks';
import useDownload from '@/hooks/useDownload';

import { database } from '@/models/database';

interface InfoConnectionPoolModalProps {
  service: database.Service;
  connectionPool: database.postgresql.ConnectionPool;
  databases: database.service.Database[];
  controller: ModalController;
}
const InfoConnectionPool = ({
  service,
  connectionPool,
  databases,
  controller,
}: InfoConnectionPoolModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );
  const toast = useToast();

  const certificateQuery = useGetCertificate(
    projectId,
    service.engine,
    service.id,
  );

  const { download } = useDownload();

  const poolDb: database.service.Database = databases.find(
    (db) => db.id === connectionPool.databaseId,
  );

  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('infoConnectionPoolTitle')}</DialogTitle>
        </DialogHeader>
        {certificateQuery.isSuccess ? (
          <div className="mt-4">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolDatabaseLabel')}
                  </TableCell>
                  <TableCell>{poolDb.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolPortLabel')}
                  </TableCell>
                  <TableCell>{connectionPool.port}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolSslLabel')}
                  </TableCell>
                  <TableCell>{connectionPool.sslMode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolCertificateLabel')}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center h-6 max-w-[350px]">
                      <p className="flex-1 truncate">
                        {certificateQuery.data.ca}
                      </p>
                      <Button
                        type="button"
                        size="table"
                        variant="ghost"
                        className="ml-2 hover:bg-primary-100 hover:text-primary-700 hover:font-semibold"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            certificateQuery.data.ca,
                          );
                          toast.toast({
                            title: t('infoConnectionPoolCertificateCopyToast'),
                          });
                        }}
                      >
                        <Files className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="table"
                        variant="ghost"
                        className="ml-2 hover:bg-primary-100 hover:text-primary-700 hover:font-semibold"
                        onClick={() => {
                          download(certificateQuery.data.ca, 'ca.pem');
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
                    <div className="flex justify-center h-6 max-w-[350px]">
                      <p className="flex-1 truncate">{connectionPool.uri}</p>
                      <Button
                        type="button"
                        size="table"
                        variant="ghost"
                        className="ml-2 hover:bg-primary-100 hover:text-primary-700 hover:font-semibold"
                        onClick={() => {
                          navigator.clipboard.writeText(connectionPool.uri);
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
                  <TableCell>{connectionPool.mode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">
                    {t('infoConnectionPoolSizeLabel')}
                  </TableCell>
                  <TableCell>{connectionPool.size}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <P>{t('infoConnectionPoolLoading')}</P>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InfoConnectionPool;
