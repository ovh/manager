import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@datatr-ux/uxlib';
import FileUploader from '@/components/file-uploader/FileUploader.component';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetPresignUrlS3 } from '@/data/hooks/s3-storage/useGetPresignUrlS3.hook';
import { useS3Data } from '../../S3.context';
import storages from '@/types/Storages';
import { useAddS3Object } from '@/data/hooks/s3-storage/useAddS3Object.hook';

const AddObjectModal = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { projectId } = useParams();

  const { s3 } = useS3Data();
  const navigate = useNavigate();
  const toast = useToast();

  // TODO: Api should return list of available service for a container
  const is3AZ = s3.region === 'EU-WEST-PAR';

  const { addS3Object, isPending: pendingAddS3Object } = useAddS3Object({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onAddSuccess: () => {
      toast.toast({
        title: t('objectToastSuccessTitle'),
        description: t('addObjectToastSuccessDescription'),
      });
    },
  });

  const {
    getPresignUrlS3,
    isPending: pendingGetPresignUrl,
  } = useGetPresignUrlS3({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (presignUrl, file) => {
      addS3Object({
        file,
        method: presignUrl.method,
        signedHeaders: presignUrl.signedHeaders,
        url: presignUrl.url,
      });
    },
  });

  return (
    <FileUploader
      multipleFileImport={true}
      onFileSelect={(files, prefix, storageClass) => {
        files.forEach((file) => {
          getPresignUrlS3(
            {
              projectId,
              region: s3.region,
              name: s3.name,
              data: {
                expire: 3600,
                method: storages.PresignedURLMethodEnum.PUT,
                object: prefix ? `${prefix}/${file.name}` : file.name,
                storageClass,
                versionId: '',
              },
            },
            file,
          );
        });
        navigate('../');
      }}
      title={t('addOjectModalTitle')}
      pending={pendingGetPresignUrl || pendingAddS3Object}
      isS3={true}
      is3AZ={is3AZ}
    />
  );
};

export default AddObjectModal;
