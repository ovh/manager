import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotebookData } from '../../Notebook.context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OVH_TAGS_CONFIG } from '@/lib/notebookHelper';
import { useEditLabel } from '@/hooks/api/ai/notebook/label/useEditLabel.hook';
import { useToast } from '@/components/ui/use-toast';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import * as ai from '@/types/cloud/project/ai';
import LabelsForm from '@/components/labels/LabelsForm.component';

const Labels = () => {
  const { notebook, notebookQuery, projectId } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/dashboard');
  const toast = useToast();

  const { editLabel, isPending } = useEditLabel({
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
        description: t('deleteNotebookSuccess'),
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
    <>
      <div data-testid="labels-container">
        <LabelsForm
          configuredLabels={
            notebook?.spec?.labels &&
            Object.entries(notebook.spec.labels).map(([key, value]) => ({
              name: key,
              value,
            }))
          }
          displayLabels={false}
          onAdd={(newLabel) => handleAddLabel(newLabel)}
        />
        <div className="flex flex-wrap gap-2 mt-4">
          {notebook.spec.labels &&
            Object.entries(notebook.spec.labels)
              .filter(
                ([labkey]) =>
                  labkey !== OVH_TAGS_CONFIG.id &&
                  labkey !== OVH_TAGS_CONFIG.type,
              )
              .map(([labKey, value]) => (
                <Badge className="py-1" key={labKey} variant={'info'}>
                  <div className="flex flex-row gap-1">
                    <span key={`span_${labKey}`}>
                      {labKey} = {value}
                    </span>
                    <Button
                      key={`button_${labKey}`}
                      disabled={isPending}
                      size="table"
                      type="button"
                      variant="ghost"
                      className="inline"
                      onClick={() => handleDeleteLabel(labKey)}
                    >
                      <X className="size-3 mx-auto" />
                    </Button>
                  </div>
                </Badge>
              ))}
        </div>
      </div>
    </>
  );
};

export default Labels;
