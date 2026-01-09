import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Badge, Button, useToast } from '@datatr-ux/uxlib';
import LabelsForm, { Label } from '@/components/labels/LabelsForm.component';
import { useS3Data } from '../../S3.context';
import { useUpdateS3 } from '@/data/hooks/s3-storage/useUpdateS3.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';

const Tags = () => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const toast = useToast();

  const configuredLabel: Label[] = useMemo(
    () =>
      s3?.tags
        ? Object.entries(s3?.tags).map(([key, value]) => ({ key, value }))
        : [],
    [s3],
  );

  const { updateS3Storage, isPending } = useUpdateS3({
    onError: (err) => {
      toast.toast({
        title: t('toastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('toastSuccessTitle'),
      });
      setIsAddTagOpen(false);
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

    updateS3Storage({
      projectId,
      region: s3.region,
      name: s3.name,
      data: {
        tags: neWtags,
      },
    });
  };

  const handleAddLabel = (label: Label) => {
    updateS3Storage({
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
    <div data-testid="tags-container">
      <Button
        disabled={isPending}
        data-testid="label-add-button"
        mode="outline"
        size="sm"
        className="h-6"
        onClick={() => setIsAddTagOpen(true)}
      >
        <Plus className="size-4" />
        <span className="font-semibold">{t('addButtonLabel')}</span>
      </Button>
      <div className="flex flex-wrap gap-2 mt-4">
        {configuredLabel.map((label) => (
          <Badge key={label.key} variant="primary">
            <div className="inline-flex flex-row gap-1 items-center justify-center">
              <span key={`span_${label.key}`}>
                {`${label.key} = ${label.value}`}
              </span>
              <Button
                data-testid={`button_${label.key}`}
                key={`button_${label.key}`}
                type="button"
                className="h-3 w-3 px-2 py-2 rounded-full border border-white hover:bg-primary-200 bg-transparent text-white"
                onClick={() => handleDeleteLabel(label.key)}
              >
                <X className="text-white shrink-0 size-3 stroke-[3]" />
              </Button>
            </div>
          </Badge>
        ))}
      </div>

      {isAddTagOpen && (
        <LabelsForm
          configuredLabels={configuredLabel}
          onAdd={(newLabel) => handleAddLabel(newLabel)}
          open={isAddTagOpen}
          onOpenChange={setIsAddTagOpen}
        />
      )}
    </div>
  );
};

export default Tags;
