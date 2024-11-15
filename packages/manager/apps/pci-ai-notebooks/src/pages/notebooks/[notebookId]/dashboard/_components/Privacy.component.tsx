import { Plus, ShieldAlert, ShieldCheck, X } from 'lucide-react';
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

const Privacy = () => {
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
        <div className="flex flex-row items-center gap-3 ">
          <h5>Tags</h5>
          <Button
            size="roundedIcon"
            type="button"
            className="inline"
            onClick={() => addModale.open()}
            disabled={Object.entries(notebook.spec.labels).length >= CONFIGURATION_CONFIG.maxLabelNumber}
          >
            <Plus className="size-5 mx-auto fill-white stroke-2" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {notebook.spec.labels &&
            Object.entries(notebook.spec.labels).map(([key, value]) => (
              <Badge variant={!isOvhTags(key) ? 'default' : 'info'}>
                <div className="flex flex-row gap-1">
                  <span key={key}>
                    {key} = {value}
                  </span>
                  {!isOvhTags(key) && (
                    <Button
                      disabled={isPending}
                      size="table"
                      type="button"
                      className="inline"
                      onClick={() => handleDeleteLabel(key)}
                    >
                      <X className="size-3 mx-auto" />
                    </Button>
                  )}
                </div>
              </Badge>
            ))}
        </div>
        <div className="mt-4">
          {notebook.spec.unsecureHttp ? (
            <div className="flex flex-row gap-2 items-center font-semibold">
              <h5>Accès publique</h5>
              <ShieldAlert className="size-4 text-amber-400" />
            </div>
          ) : (
            <div className="flex flex-row gap-2 items-center font-semibold">
              <h5>Accès privé</h5>
              <ShieldCheck className="size-4 text-green-500" />
            </div>
          )}
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

export default Privacy;
