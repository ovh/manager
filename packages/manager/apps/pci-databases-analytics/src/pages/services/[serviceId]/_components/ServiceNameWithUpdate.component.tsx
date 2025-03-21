import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Check, Pen, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Input,
  Button,
  Skeleton,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useToast,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useRenameServiceForm } from './useRenameServiceForm';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
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
          <div className="flex gap-2 justify-end items-center">
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              mode="ghost"
              className="text-text size-4 p-0 hover:bg-transparent hover:text-primary"
              data-testid="cancel-button"
            >
              <X />
            </Button>
            <Button
              type="submit"
              mode="ghost"
              className="text-text size-4 p-0 hover:bg-transparent hover:text-primary"
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
    <div className="flex gap-2 items-center">
      <h2>{service.description}</h2>
      <Button
        onClick={() => setIsEditing(true)}
        mode="ghost"
        className="text-text size-4 p-0 hover:bg-transparent hover:text-primary"
        data-testid="edit-button"
      >
        <Pen />
      </Button>
    </div>
  );
};

export default ServiceNameWithUpdate;
