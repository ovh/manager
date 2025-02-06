import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNotebookData } from '../../Notebook.context';
import { useEditLabel } from '@/hooks/api/ai/notebook/label/useEditLabel.hook';
import { useToast } from '@/components/ui/use-toast';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import * as ai from '@/types/cloud/project/ai';
import LabelsForm from '@/components/labels/LabelsForm.component';
import { OVH_TAGS_CONFIG } from '@/configuration/label';

const Labels = () => {
  const { notebook, notebookQuery, projectId } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/dashboard');
  const toast = useToast();

  const configuredLabel: ai.Label[] = useMemo(
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
        title: t('notebookToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('notebookToastSuccessTitle'),
        description: t('notebookLabelSuccess'),
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

  const handleAddLabel = (label: ai.Label) => {
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
