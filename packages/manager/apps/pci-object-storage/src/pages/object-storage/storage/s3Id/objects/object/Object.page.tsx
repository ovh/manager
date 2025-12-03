import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Download,
  DownloadIcon,
  Settings,
} from 'lucide-react';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useGetS3ObjectVersions } from '@/data/hooks/s3-storage/useGetS3ObjectVersions.hook';
import { useS3Data } from '../../S3.context';
import { useGetS3Object } from '@/data/hooks/s3-storage/useGetS3Object.hook';
import { octetConverter } from '@/lib/bytesHelper';
import FileIcon from '@/components/file-icon/FileIcon.component';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import DataTable from '@/components/data-table';
import S3ObjectVersionList from './_components/S3VersionObjectListTable.component';
import { useS3ObjectActions } from '../_hooks/useS3ObjectActions.hook';
import NavLink from '@/components/links/NavLink.component';
import { ObjectDownloadButton } from './_components/ObjectDownloadButton.component';
import { DeepArchiveBadge } from '../_components/DeepArchiveBadge.component';
import storages from '@/types/Storages';
import { isDeepArchive } from '@/lib/s3ObjectHelper';
import { is } from 'date-fns/locale';
import { splitObjectKey } from '@/lib/fileNameHelper';
import Link from '@/components/links/Link.component';

const Object = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const navigate = useNavigate();
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
    options: { retry: false },
  });

  const {
    needsRestore,
    isDownloadActionDisabled,
    onDownloadClicked,
    onRestoreClicked,
    pendingGetPresignUrl,
  } = useS3ObjectActions({
    object: objectQuery.data,
    showVersion: false,
  });

  const { path, file } = splitObjectKey(objectKey);
  return (
    <>
      <Link to="../" className="flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('backLink')}
      </Link>
      <div className="flex flex-col gap-2">
        <Card>
          <CardHeader>
            <h4 className="flex flex-row gap-2 items-center">
              <FileIcon fileName={objectKey} className="size-6" />
              <span>{file}</span>
            </h4>
          </CardHeader>
          <CardContent>
            <table className="border-b border-gray-200 border-collapse my-4 w-full">
              <tbody>
                {path && (
                  <tr className="border-b border-gray-200">
                    <td className="font-semibold py-2">Prefix</td>
                    <td className="text-right">{path}</td>
                    <td />
                  </tr>
                )}

                <tr className="border-b border-gray-200">
                  <td className="font-semibold py-2">{t('tableHeaderSize')}</td>
                  <td className="text-right">
                    {octetConverter(objectQuery.data.size, true, 2)}
                  </td>
                  <td />
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="font-semibold py-2">
                    {t('tableHeaderUpdateDate')}
                  </td>
                  <td className="text-right">
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
                  </td>
                  <td className="text-right">
                    <Button
                      mode='outline'
                      className="h-6"
                      disabled={isDownloadActionDisabled || needsRestore}
                      onClick={() => onDownloadClicked()}
                    >
                      Telecharger
                      <DownloadIcon className="size-4" />
                    </Button>
                  </td>
                </tr>
                {objectQuery.data.storageClass && (
                  <tr className="border-b border-gray-200">
                    <td className="font-semibold py-2">
                      {t('tableHeaderStorageClass')}
                    </td>
                    <td className="text-right">
                      <Badge variant="outline">
                        {tObj(`objectClass_${objectQuery.data.storageClass}`)}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <NavLink
                        className="py-0 ml-2"
                        to={`./change-storage-class?objectKey=${encodeURIComponent(
                          objectKey,
                        )}`}
                      >
                        {t('Modifier')}
                      </NavLink>
                    </td>
                  </tr>
                )}
                {isDeepArchive(objectQuery.data) && (
                  <tr className="border-b border-gray-200">
                    <td className="font-semibold py-2">Status</td>
                    <td className="text-right">
                      <DeepArchiveBadge object={objectQuery.data} />
                    </td>
                    <td className="text-right">
                      <>
                        {!objectQuery.data.restoreStatus?.inProgress && (
                          <NavLink
                            className="py-0 ml-2"
                            to={`./restore-object?objectKey=${encodeURIComponent(
                              objectKey,
                            )}`}
                          >
                            {t('tableRestoreButton')}
                          </NavLink>
                        )}
                      </>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h4>{t('versionsTitle')}</h4>
          </CardHeader>
          <CardContent>
            <S3ObjectVersionList objects={objectVersionQuery.data} />
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </>
  );
};

export default Object;
