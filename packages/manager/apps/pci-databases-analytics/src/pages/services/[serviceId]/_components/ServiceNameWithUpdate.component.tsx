import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Check, Pen, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import * as database from '@/types/cloud/project/database';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useRenameServiceForm } from './useRenameServiceForm';
import { Input } from '@/components/ui/input';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import { useToast } from '@/components/ui/use-toast';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

const ServiceNameWithUpdate = ({ service }: { service: database.Service }) => {
  const { t } = useTranslation('pci-databases-analytics/services/service');
  const [isEditing, setIsEditing] = useState(false);
  const { projectId } = useParams();
  const form = useRenameServiceForm(service);
  const toast = useToast();
  const { editService } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('renameServiceToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onEditSuccess: (renamedService) => {
      toast.toast({
        title: t('renameServiceToastSuccessTitle'),
        description: t('renameServiceToastSuccessDescription', {
          newName: renamedService.description,
        }),
      });
      setIsEditing(false);
    },
  });
  const onSubmit = form.handleSubmit((formValues) => {
    editService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data: {
        description: formValues.description,
      },
    });
  });

  useEffect(() => {
    form.reset();
    form.setValue('description', service.description);
  }, [isEditing]);

  if (!service) {
    return <Skeleton className="h-4 w-36" />;
  }
  if (isEditing) {
    return (
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex gap-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="mb-[5px]"
                    data-testid="rename-service-input"
                    placeholder="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              variant="ghost"
              size="table"
              className="py-0 h-auto"
              data-testid="cancel-button"
            >
              <X />
            </Button>
            <Button
              type="submit"
              variant="ghost"
              size="table"
              className="py-0 h-auto"
              data-testid="validate-button"
            >
              <Check />
            </Button>
          </div>
        </form>
      </Form>
    );
  }
  return (
    <div className="flex gap-2">
      <h2>{service.description}</h2>
      <Button
        onClick={() => setIsEditing(true)}
        variant="ghost"
        size="table"
        className="py-0 h-auto"
        data-testid="edit-button"
      >
        <Pen />
      </Button>
    </div>
  );
};

export default ServiceNameWithUpdate;
