import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useEditLabel } from '@/hooks/api/ai/notebook/label/useEditLabel.hook';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';
import { useNotebookData } from '../../Notebook.context';

const AddLabel = () => {
  const { projectId } = useParams();
  const { notebook } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/dashboard');
  const toast = useToast();
  const navigate = useNavigate();

  const { editLabel, isPending } = useEditLabel({
    onError: (err) => {
      toast.toast({
        title: t('notebookToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onEditSuccess: () => {
      toast.toast({
        title: t('notebookToastSuccessTitle'),
        description: t('deleteNotebookSuccess'),
      });
      navigate('../');
    },
  });
  // define the schema for the form
  const labelSchema = z.object({
    name: z
      .string()
      .min(1)
      .max(15)
      .refine(
        (newKey) => notebook.spec.labels && !(newKey in notebook.spec.labels),
        {
          message: t('existingKeyError'),
        },
      ),
    value: z
      .string()
      .min(1)
      .max(15),
  });
  // generate a form controller
  const form = useForm<z.infer<typeof labelSchema>>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      name: '',
      value: '',
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    editLabel({
      projectId,
      notebookId: notebook.id,
      label: {
        name: formValues.name,
        value: formValues.value,
      },
    });
  });

  return (
    <RouteModal backUrl="../">
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="rename-service-modal">
            {t('addLabelTitle')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="name-field-label">
                    {t('keyFieldLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input data-testid="key-input-field" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              defaultValue=""
              render={({ field }) => (
                <FormItem data-testid="value-field-label">
                  <FormLabel>{t('valueFieldLabel')}</FormLabel>
                  <FormControl>
                    <Input data-testid="value-input-field" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="add-label-cancel-button"
                  type="button"
                  variant="outline"
                >
                  {t('addLabelButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="add-label-submit-button"
                type="submit"
                disabled={isPending}
              >
                {t('addLabelNameSubmit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default AddLabel;
