import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { Archive, Settings } from 'lucide-react';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useGetS3ObjectVersions } from '@/data/hooks/s3-storage/useGetS3ObjectVersions.hook';
import { useS3Data } from '../../S3.context';
import { useGetS3Object } from '@/data/hooks/s3-storage/useGetS3Object.hook';
import FileIcon from '@/components/file-icon/FileIcon.component';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';

const Object = () => {
  const localeBytesConverter = useLocaleBytesConverter();
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card data-testid="object-info-card">
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
            <div className="grid grid-cols-2 gap-4 items-center">
              <p className="font-semibold">{t('tableHeaderSize')}</p>
              <div className="flex flex-row items-center justify-end gap-4">
                <p>{localeBytesConverter(objectQuery.data.size, true, 2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center mt-2">
              <p className="font-semibold">{t('tableHeaderUpdateDate')}</p>
              <div className="flex flex-row items-center justify-end gap-4">
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
              </div>
            </div>
          </CardContent>
        </Card>

        {objectQuery.data.storageClass && (
          <Card data-testid="storage-class-card">
            <CardHeader>
              <h5>
                <Archive className="size-4 inline mr-2" />
                <span>{t('tableHeaderStorageClass')}</span>
              </h5>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row justify-between">
                <Badge variant="outline">
                  {tObj(`objectClass_${objectQuery.data.storageClass}`)}
                </Badge>

                <Button
                  data-testid="change-storage-class-button"
                  className="h-6"
                  mode="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `./change-storage-class?objectKey=${encodeURIComponent(
                        objectKey,
                      )}`,
                    )
                  }
                >
                  <Settings className="size-4" />
                  <span className="font-semibold">
                    {t('changeStorageClassLink')}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Outlet />
    </>
  );
};

export default Object;
