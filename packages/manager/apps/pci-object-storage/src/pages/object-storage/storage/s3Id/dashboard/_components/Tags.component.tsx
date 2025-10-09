import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@datatr-ux/uxlib';
import LabelsForm, { Label } from '@/components/labels/LabelsForm.component';
import { useS3Data } from '../../S3.context';
import { useUpdateS3 } from '@/data/hooks/s3-storage/useUpdateS3.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';

const Tags = () => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const toast = useToast();

  const configuredLabel: Label[] = useMemo(
    () =>
      s3?.tags
        ? Object.entries(s3?.tags).map(([key, value]) => ({ key, value }))
        : [],
    [s3],
  );

  const { udpateS3Storage, isPending } = useUpdateS3({
    onError: (err) => {
      toast.toast({
        title: t('toastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('toastSuccessTitle'),
      });
    },
  });

  const handleDeleteLabel = (key: string) => {
    const neWtags: { [key: string]: string } = configuredLabel
      ?.filter((lab) => lab.key !== key)
      ?.reduce((acc, label) => {
        if (label.key && label.value) {
          acc[label.key] = label.value;
        }
        return acc;
      }, {} as { [key: string]: string });

    udpateS3Storage({
      projectId,
      region: s3.region,
      name: s3.name,
      data: {
        tags: neWtags,
      },
    });
  };

  const handleAddLabel = (label: Label) => {
    udpateS3Storage({
      projectId,
      region: s3.region,
      name: s3.name,
      data: {
        tags: {
          ...s3?.tags,
          [label.key]: label.value,
        },
      },
    });
  };

  return (
    <div>
      <LabelsForm
        configuredLabels={configuredLabel}
        onAdd={(newLabel) => handleAddLabel(newLabel)}
        onDelete={(newLabel) => handleDeleteLabel(newLabel.key)}
        disabled={isPending}
      />
    </div>
  );
};

export default Tags;
