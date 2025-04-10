import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useToast } from '@datatr-ux/uxlib';
import { useNotebookData } from '../../Notebook.context';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import LabelsForm from '@/components/labels/LabelsForm.component';
import { OVH_TAGS_CONFIG } from '@/configuration/label';
import { useEditLabel } from '@/data/hooks/ai/notebook/label/useEditLabel.hook';
import { OrderLabel } from '@/types/orderFunnel';

const Labels = () => {
  const { notebook, notebookQuery, projectId } = useNotebookData();
  const { t } = useTranslation('ai-tools/components/labels');
  const toast = useToast();

  const configuredLabel: OrderLabel[] = useMemo(
    () =>
      notebook?.spec?.labels &&
      Object.entries(notebook.spec.labels)
        .filter(
          ([key]) => key !== OVH_TAGS_CONFIG.id && key !== OVH_TAGS_CONFIG.type,
        )
        .map(([key, value]) => ({
          name: key,
          value,
        })),
    [notebook],
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
      notebookQuery.refetch();
    },
  });

  const handleDeleteLabel = (key: string) => {
    editLabel({
      projectId,
      notebookId: notebook.id,
      label: {
        name: key,
      },
    });
  };

  const handleAddLabel = (label: OrderLabel) => {
    editLabel({
      projectId,
      notebookId: notebook.id,
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
