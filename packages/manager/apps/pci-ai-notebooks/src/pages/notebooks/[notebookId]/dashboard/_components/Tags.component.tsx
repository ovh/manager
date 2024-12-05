import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotebookData } from '../../Notebook.context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isOvhTags } from '@/lib/notebookHelper';
import { useEditLabel } from '@/hooks/api/ai/notebook/label/useEditLabel.hook';
import { useToast } from '@/components/ui/use-toast';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import AddLabel from './AddLabel.component';
import { useModale } from '@/hooks/useModale';
import { CONFIGURATION_CONFIG } from '@/components/order/configuration/configuration.constants';

const Tags = () => {
  const { notebook, notebookQuery, projectId } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/dashboard');
  const toast = useToast();
  const addModale = useModale('add');

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

  return (
    <>
      <div data-testid="privacy-container">
        <Button
          size="sm"
          variant="outline"
          type="button"
          onClick={() => addModale.open()}
          disabled={
            Object.entries(notebook.spec.labels).length >=
            CONFIGURATION_CONFIG.maxLabelNumber
          }
        >
          <div className="flex flex-row gap-2 items-center">
            <Plus className="size-4" />
            <span>Add Tag</span>
          </div>
        </Button>
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
      <AddLabel
        controller={addModale.controller}
        notebook={notebook}
        onSuccess={() => {
          addModale.close();
          notebookQuery.refetch();
        }}
      />
    </>
  );
};

export default Tags;
