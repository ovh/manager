import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { ArrowRight, FileStack } from 'lucide-react';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { useGetS3ObjectVersions } from '@/data/hooks/s3-storage/useGetS3ObjectVersions.hook';
import { useS3Data } from '../../S3.context';
import { useGetS3Object } from '@/data/hooks/s3-storage/useGetS3Object.hook';
import { octetConverter } from '@/lib/bytesHelper';
import { getTotalVersionsSize } from '@/lib/s3ObjectHelper';
import Link from '@/components/links/Link.component';
import FileIcon from '@/components/fileIcon/FileIcon.component';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';

const Object = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const [searchParams] = useSearchParams();
  const objectKey = searchParams.get('objectKey');

  const objectVersionQuery = useGetS3ObjectVersions({
    projectId,
    region: s3.region,
    name: s3.name,
    key: objectKey,
  });

  const objectQuery = useGetS3Object({
    projectId,
    region: s3.region,
    name: s3.name,
    key: objectKey,
  });

  if (objectQuery.isLoading || objectVersionQuery.isLoading) {
    return (
      <>
        <div className="flex space-x-4">
          <Skeleton className="w-1/2 h-[200px]" />
          <Skeleton className="w-1/2 h-[200px]" />
        </div>
      </>
    );
  }

  return (
    <>
      <h2>{t('objTitle')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h5>
              <FileIcon
                fileName={objectQuery.data.key}
                className="size-4 inline mr-2"
              />
              <span>{t('objectInfoTitle')}</span>
            </h5>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-semibold">
                    {t('tableHeaderName')}
                  </TableCell>
                  <TableCell>{objectQuery.data.key}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-semibold">
                    {t('tableHeaderSize')}
                  </TableCell>
                  <TableCell>
                    {octetConverter(objectQuery.data.size, true, 2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-semibold">
                    {t('tableHeaderType')}
                  </TableCell>
                  <TableCell>
                    {tObj(`objectClass_${objectQuery.data.storageClass}`)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-semibold">
                    {!objectQuery.data.isDeleteMarker &&
                      t('tableHeaderUpdateDate')}
                  </TableCell>
                  <TableCell>
                    <FormattedDate
                      options={{
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      }}
                      date={new Date(objectQuery.data.lastModified)}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Card>
            <CardHeader>
              <h5>
                <FileStack className="size-4 inline mr-2" />
                <span>{t('versionsTitle')}</span>
              </h5>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-semibold">
                      {t('versionsNumber')}
                    </TableCell>
                    <TableCell>{objectVersionQuery.data?.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-semibold">
                      {t('versionTotalSize')}
                    </TableCell>
                    <TableCell>
                      {objectVersionQuery?.data?.length > 0 &&
                        octetConverter(
                          getTotalVersionsSize(objectVersionQuery?.data),
                          true,
                          2,
                        )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Link
                to={`./versions?objectKey=${encodeURIComponent(objectKey)}`}
                className="flex flex-row gap-1 mt-2"
              >
                {t('versionLink')}
                <ArrowRight className="w-4 h-4 mt-1 text-primary" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Object;
