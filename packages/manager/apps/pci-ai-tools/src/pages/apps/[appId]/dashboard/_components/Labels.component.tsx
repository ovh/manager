import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useToast } from '@datatr-ux/uxlib';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import LabelsForm from '@/components/labels/LabelsForm.component';
import { useAppData } from '../../App.context';
import { OVH_TAGS_CONFIG } from '@/configuration/label';
import { useEditLabel } from '@/data/hooks/ai/app/label/useEditLabel.hook';
import { OrderLabel } from '@/types/orderFunnel';

const Labels = () => {
  const { app, appQuery, projectId } = useAppData();
  const { t } = useTranslation('ai-tools/components/labels');
  const toast = useToast();

  const configuredLabel: OrderLabel[] = useMemo(
    () =>
      app?.spec?.labels &&
      Object.entries(app.spec.labels)
        .filter(
          ([key]) => key !== OVH_TAGS_CONFIG.id && key !== OVH_TAGS_CONFIG.type,
        )
        .map(([key, value]) => ({
          name: key,
          value,
        })),
    [app],
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
      });
      appQuery.refetch();
    },
  });

  const handleDeleteLabel = (key: string) => {
    editLabel({
      projectId,
      appId: app.id,
      label: {
        name: key,
      },
    });
  };

  const handleAddLabel = (label: OrderLabel) => {
    editLabel({
      projectId,
      appId: app.id,
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
