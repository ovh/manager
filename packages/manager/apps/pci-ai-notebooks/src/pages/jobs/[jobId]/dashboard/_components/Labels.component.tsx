import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import * as ai from '@/types/cloud/project/ai';
import LabelsForm from '@/components/labels/LabelsForm.component';
import { useJobData } from '../../Job.context';
import { useEditLabel } from '@/hooks/api/ai/job/label/useEditLabel.hook';
import { OVH_TAGS_CONFIG } from '@/configuration/label';

const Labels = () => {
  const { job, jobQuery, projectId } = useJobData();
  const { t } = useTranslation('components/labels');
  const toast = useToast();

  const configuredLabel: ai.Label[] = useMemo(
    () =>
      job?.spec?.labels &&
      Object.entries(job.spec.labels)
        .filter(
          ([key]) => key !== OVH_TAGS_CONFIG.id && key !== OVH_TAGS_CONFIG.type,
        )
        .map(([key, value]) => ({
          name: key,
          value,
        })),
    [job],
  );

  const { editLabel } = useEditLabel({
    onError: (err) => {
      toast.toast({
        title: t('labelToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('labelToastSuccessTitle'),
        description: t('labelToastSuccessDescription'),
      });
      jobQuery.refetch();
    },
  });

  const handleDeleteLabel = (key: string) => {
    editLabel({
      projectId,
      jobId: job.id,
      label: {
        name: key,
      },
    });
  };

  const handleAddLabel = (label: ai.Label) => {
    editLabel({
      projectId,
      jobId: job.id,
      label: {
        name: label.name,
        value: label.value,
      },
    });
  };

  return (
    <div data-testid="labels-container">
      <LabelsForm
        configuredLabels={configuredLabel}
        onAdd={(newLabel) => handleAddLabel(newLabel)}
        onDelete={(newLabel) => handleDeleteLabel(newLabel.name)}
      />
    </div>
  );
};

export default Labels;
