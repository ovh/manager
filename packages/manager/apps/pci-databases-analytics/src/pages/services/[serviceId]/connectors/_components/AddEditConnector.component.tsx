import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Skeleton,
  useToast,
} from '@datatr-ux/uxlib';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import {
  UseAddConnector,
  useAddConnector,
} from '@/hooks/api/database/connector/useAddConnector.hook';
import { CdbError } from '@/data/api/database';
import { useGetConnectorsCapabilities } from '@/hooks/api/database/connector/useGetConnectorsCapabilities.hook';
import { useGetConnectorConfiguration } from '@/hooks/api/database/connector/useGetConnectorConfiguration.hook';
import A from '@/components/links/A.component';
import { useServiceData } from '../../Service.context';
import ConnectorConfigurationEditor from '../add/ConnectorConfigurationEditor.component';
import * as database from '@/types/cloud/project/database';
import Link from '@/components/links/Link.component';
import { useEditConnector } from '@/hooks/api/database/connector/useEditConnector.hook';

interface IAddEditConnectorProps {
  connectorToEdit?: database.kafkaConnect.Connector;
}
const AddEditConnector = ({ connectorToEdit }: IAddEditConnectorProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/connectors',
  );
  const { projectId, service } = useServiceData();
  const editorComponentRef = useRef<{
    getValue: () => string | undefined;
    resetValue: () => void;
  }>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const prefix = connectorToEdit ? 'edit' : 'add';

  // Function to stringify values in the JSON configuration
  function stringifyValues(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj.map(stringifyValues);
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key,
          stringifyValues(value),
        ]),
      );
    }
    return String(obj);
  }

  const connectorMutationConfig: UseAddConnector = {
    onSuccess: () => {
      toast.toast({ title: t(`${prefix}ConnectorToastSuccessDescription`) });
      navigate('..');
    },
    onError: (error) => {
      const apiError = (error as CdbError).response?.data;

      const details = apiError?.details
        ? Object.values(apiError.details).map((e) => <p>{e}</p>)
        : null;
      toast.toast({
        title: t(`${prefix}ConnectorToastErrorTitle`),
        variant: 'destructive',
        description: details,
      });
    },
  };
  const { addConnector, isPending: isPendingAdd } = useAddConnector(
    connectorMutationConfig,
  );
  const { editConnector, isPending: isPendingEdit } = useEditConnector(
    connectorMutationConfig,
  );

  const connectorsCapabilitiesQuery = useGetConnectorsCapabilities(
    projectId,
    service.engine,
    service.id,
  );

  const connectorsCapabilities = connectorsCapabilitiesQuery.data ?? [];

  const [connectorCapability, setConnectorCapability] = useState(
    connectorsCapabilities[0] ?? null,
  );

  useEffect(() => {
    if (connectorsCapabilities.length > 0) {
      setConnectorCapability(connectorsCapabilities[0]);
    }
  }, [connectorsCapabilities]);

  const connectorConfigurationQuery = useGetConnectorConfiguration(
    projectId,
    service.engine,
    service.id,
    connectorCapability?.id,
    {
      enabled: !!connectorCapability?.id,
    },
  );

  const connectorConfiguration = connectorConfigurationQuery.data;

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
      name: '',
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const configuration = stringifyValues(
      JSON.parse(editorComponentRef.current?.getValue()),
    ) as { [key: string]: string };
    if (connectorToEdit) {
      editConnector({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        connector: {
          ...connectorToEdit,
          configuration,
        },
      });
    } else {
      addConnector({
        projectId,
        engine: service.engine,
        serviceId: service.id,
        connector: {
          name: formValues.name,
          configuration,
          connectorId: connectorCapability?.id,
        },
      });
    }
  });

  useEffect(() => {
    if (connectorToEdit) {
      setConnectorCapability(
        connectorsCapabilities.find(
          (c) => c.id === connectorToEdit.connectorId,
        ),
      );
      form.reset({
        name: connectorToEdit.name,
      });
    }
  }, [connectorToEdit, connectorsCapabilities, form]);

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t(`${prefix}ConnectorTitle`)}</h2>
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
      <Card>
        <CardContent className="py-2 my-0">
          <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-4 mb-2">
              {connectorsCapabilitiesQuery.data && (
                <>
                  <FormLabel>{t('formConnectorLabelConnector')}</FormLabel>
                  <Select
                    disabled={!!connectorToEdit}
                    value={connectorCapability?.id}
                    onValueChange={(id) =>
                      setConnectorCapability(
                        connectorsCapabilities.find((c) => c.id === id),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('formConnectorPlaceholederConnector')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Source</SelectLabel>
                        {connectorsCapabilitiesQuery.data?.length &&
                          connectorsCapabilitiesQuery.data
                            ?.filter(
                              (c) =>
                                c.type ===
                                database.kafkaConnect.capabilities.connector
                                  .TypeEnum.source,
                            )
                            .map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Sink</SelectLabel>
                        {connectorsCapabilitiesQuery.data?.length &&
                          connectorsCapabilitiesQuery.data
                            ?.filter(
                              (c) =>
                                c.type ===
                                database.kafkaConnect.capabilities.connector
                                  .TypeEnum.sink,
                            )
                            .map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </>
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formConnectorLabelName')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!!connectorToEdit}
                        placeholder={t('formConnectorPlaceholderName')}
                        data-testid="add-connector-name-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormLabel>{t('formConnectorLabelConfiguration')}</FormLabel>
              {connectorConfiguration && (
                <ConnectorConfigurationEditor
                  ref={editorComponentRef}
                  connectorCapabilities={connectorConfiguration}
                  initialValue={connectorToEdit?.configuration}
                />
              )}
              {!connectorConfiguration && (
                <Skeleton className="h-[60vh] w-full" />
              )}
              <div className="w-full">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={
                    !connectorConfiguration || isPendingAdd || isPendingEdit
                  }
                >
                  {t(`${prefix}ConnectorButtonLabel`)}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default AddEditConnector;
