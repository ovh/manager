import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotebookData } from '../../Notebook.context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isOvhTags } from '@/lib/notebookHelper';
import { useEditLabel } from '@/hooks/api/ai/notebook/label/useEditLabel.hook';
import { useToast } from '@/components/ui/use-toast';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import LabelForm from '@/components/labels/LabelDashboardForm.component';
import * as ai from '@/types/cloud/project/ai';

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
      <div data-testid="privacy-container">
        <LabelForm
          labelValue={Object.keys(notebook.spec.labels)}
          onChange={(newLabel) => handleAddLabel(newLabel)}
        />
        <div className="flex flex-wrap gap-2 mt-4">
          {notebook.spec.labels &&
            Object.entries(notebook.spec.labels).map(([labKey, value]) => (
              <>
                {!isOvhTags(labKey) && (
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
                )}
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default Labels;
