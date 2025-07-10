import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@datatr-ux/uxlib';
import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useServiceData } from '../../Service.context';

import ConnectorConfigurationEditor from '../add/ConnectorConfigurationEditor.component';
import { CdbError } from '@/data/api/database';
import Link from '@/components/links/Link.component';
import A from '@/components/links/A.component';
import { useGetConnectorsCapabilities } from '@/hooks/api/database/connector/useGetConnectorsCapabilities.hook';
import { useGetConnector } from '@/hooks/api/database/connector/useGetConnector.hook';
import { useGetConnectorConfiguration } from '@/hooks/api/database/connector/useGetConnectorConfiguration.hook';
import { useEditConnector } from '@/hooks/api/database/connector/useEditConnector.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb-edit"
      namespace="pci-databases-analytics/services/service/connectors"
    />
  );
}

const EditConnector = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/connectors',
  );

  const { connectorId } = useParams();
  const { projectId, service } = useServiceData();
  const editorComponentRef = useRef<{
    getValue: () => string | undefined;
    resetValue: () => void;
  }>(null);
  const navigate = useNavigate();

  const toast = useToast();

  const connectorsQuery = useGetConnector(
    projectId,
    service.engine,
    service.id,
    connectorId,
    {
      enabled: !!connectorId,
    },
  );
  const connectorsCapabilitiesListQuery = useGetConnectorsCapabilities(
    projectId,
    service.engine,
    service.id,
  );

  const connectorToEdit = connectorsQuery.data;

  const connectorCapability = connectorsCapabilitiesListQuery.data?.find(
    (c) => c.id === connectorToEdit?.connectorId,
  );

  const connectorConfigQuery = useGetConnectorConfiguration(
    projectId,
    service.engine,
    service.id,
    connectorToEdit?.connectorId,
    {
      enabled: !!connectorToEdit?.connectorId,
    },
  );
  const config = connectorConfigQuery.data;

  const schema = z.object({
    name: z
      .string()
      .min(3, {
        message: t('formConnectorErrorMinLength', { min: 3 }),
      })
      .max(100, {
        message: t('formConnectorErrorMaxLength', { max: 100 }),
      }),
  });
  // generate a form controller
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: connectorToEdit?.name,
    },
  });

  const { editConnector } = useEditConnector({
    onSuccess: () => {
      toast.toast({ title: t('editConnectorToastSuccessDescription') });
      navigate('..');
    },
    onError: (error) => {
      const apiError = (error as CdbError).response?.data;

      const details = apiError?.details
        ? Object.values(apiError.details).map((e) => <p>{e}</p>)
        : null;
      toast.toast({
        title: t('editConnectorToastErrorTitle'),
        variant: 'destructive',
        description: details,
      });
    },
  });

  const onSubmit = form.handleSubmit(() => {
    editConnector({
      projectId,
      engine: service.engine,
      serviceId: service.id,
      connector: {
        ...connectorToEdit,
        configuration: JSON.parse(
          editorComponentRef.current?.getValue() || '{}',
        ),
      },
    });
  });

  useEffect(() => {
    if (connectorToEdit) {
      form.reset({
        name: connectorToEdit.name,
      });
    }
  }, [connectorToEdit, form]);

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('editConnectorTitle')}</h2>
      </div>
      <Link to="../" className="flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('backLink')}
      </Link>
      <p>{t('editorIntro')}</p>
      <ul className="list-disc list-inside">
        <li>{t('editorStep1')}</li>
        <li>
          <Trans
            t={t}
            i18nKey="editorStep2"
            components={{
              anchor: (
                <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 rig hidden md:inline-flex text-xs"></kbd>
              ),
            }}
          />
        </li>
        <li>{t('editorStep3')}</li>
        <li>
          <Trans
            t={t}
            i18nKey="editorStep4"
            components={{
              anchor: connectorCapability?.documentationUrl ? (
                <A
                  target="_blank"
                  href={connectorCapability.documentationUrl}
                ></A>
              ) : (
                <></>
              ),
            }}
          />
        </li>
      </ul>
      {connectorToEdit && config && (
        <Card>
          <CardContent className="py-2 my-0">
            {connectorCapability && (
              <>
                <Label>{t('formConnectorLabelConnector')}</Label>
                <Select value={connectorCapability.name} disabled>
                  <SelectTrigger>
                    <SelectValue>{connectorCapability.name}</SelectValue>
                  </SelectTrigger>
                </Select>
              </>
            )}
            <Form {...form}>
              <form onSubmit={onSubmit} className="grid gap-4 mb-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('formConnectorLabelName')}</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          {...field}
                          data-testid="edit-connector-name-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormLabel>{t('formConnectorLabelConfiguration')}</FormLabel>
                <ConnectorConfigurationEditor
                  ref={editorComponentRef}
                  connectorCapabilities={config}
                  initialValue={connectorToEdit?.configuration}
                />
                <div className="w-full">
                  <Button type="submit" className="w-full md:w-auto">
                    {t('formConnectorEditButtonLabel')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default EditConnector;
