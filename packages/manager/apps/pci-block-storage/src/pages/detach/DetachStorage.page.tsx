import {
  OsdsModal,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { z, ZodRawShape } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonLink } from '@/components/button-link/ButtonLink';
import {
  useDetachVolume,
  useVolume,
  UseVolumeResult,
} from '@/api/hooks/useVolume';
import { useAttachedInstances } from '@/api/hooks/useInstance';
import { useSearchFormParams } from '@/hooks/useSearchFormParams';
import { TAttachedInstance } from '@/api/select/instances';
import { useTrackBanner } from '@/hooks/useTrackBanner';
import { Button } from '@/components/button/Button';

const SelectInstance = ({ instances }: { instances: TAttachedInstance[] }) => {
  const { control } = useFormContext();
  return (
    <div>
      <Controller
        control={control}
        render={({ field: { value, onChange, onBlur, ...field } }) => (
          <OsdsSelect
            value={value}
            {...field}
            inline
            className="mt-5 w-full"
            onOdsBlur={onBlur}
            onOdsValueChange={(event) => {
              // Ods select sends value change event when incoming value has changed so we need to break it to avoid a call loop
              if (event.detail.value !== value) onChange(event.detail.value);
            }}
            data-testid="detachStorage-select-instance"
          >
            {instances.map(({ id, name }) => (
              <OsdsSelectOption key={id} value={id}>
                {name}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        )}
        name="instanceId"
      />
    </div>
  );
};

const InstanceDescription = ({
  volume,
  instances,
}: {
  volume: UseVolumeResult;
  instances: TAttachedInstance[];
}) => {
  const { t } = useTranslation('detach');
  const { control } = useFormContext();
  const selectedInstanceId = useWatch({ control, name: 'instanceId' });

  const selectedInstance = useMemo(() => {
    if (selectedInstanceId)
      return instances.find(({ id }) => id === selectedInstanceId) || null;
    return null;
  }, [selectedInstanceId, instances]);

  if (!selectedInstance) return null;

  return (
    <div className="mt-5">
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('pci_projects_project_storages_blocks_block_detach_detachvolume', {
          volume: volume.name,
          instance: selectedInstance.name,
        })}
      </OsdsText>
    </div>
  );
};

const Form = <Schema extends z.ZodObject<ZodRawShape>>({
  schema,
  onSubmit,
  values,
  children,
}: PropsWithChildren<{
  schema: Schema;
  onSubmit: SubmitHandler<Required<z.infer<Schema>>>;
  values?: Partial<z.infer<Schema>>;
}>) => {
  const { handleSubmit, formState, ...restForm } = useForm({
    resolver: zodResolver(schema),
    values,
  });
  useSearchFormParams(schema, restForm);

  return (
    <FormProvider
      formState={formState}
      handleSubmit={handleSubmit}
      {...restForm}
    >
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

const SubmitButton = ({
  label,
  region,
}: {
  label: string;
  region?: string;
}) => {
  const { formState } = useFormContext();
  return (
    <Button
      slot="actions"
      color="primary"
      disabled={!formState.isValid}
      actionName="confirm"
      actionValues={[region]}
    >
      {label}
    </Button>
  );
};

const DETACH_SCHEMA = z.object({
  instanceId: z.string(),
});

export default function DetachStorage() {
  const navigate = useNavigate();
  const { projectId, volumeId } = useParams();
  const { t } = useTranslation('detach');
  const { addError, addSuccess } = useNotifications();
  const { data: volume } = useVolume(projectId, volumeId);
  const onClose = () => navigate(`/pci/projects/${projectId}/storages/blocks`);

  const {
    data: instances,
    isPending: isInstancesPending,
  } = useAttachedInstances(projectId, volumeId);
  const actionValues = useMemo(() => [volume?.region], [volume]);

  const onTrackingBannerError = useTrackBanner(
    { type: 'error' },
    (err: Error) => {
      addError(
        <Translation ns="detach">
          {(_t) =>
            _t(
              'pci_projects_project_storages_blocks_block_detach_error_detach',
              {
                volume: volume?.name,
                message: err.message,
              },
            )
          }
        </Translation>,
        true,
      );
      console.info('ERROR');
      onClose();
    },
  );
  const onTrackingBannerSuccess = useTrackBanner({ type: 'success' }, () => {
    addSuccess(
      <Translation ns="detach">
        {(_t) =>
          _t(
            'pci_projects_project_storages_blocks_block_detach_success_message',
            {
              volume: volume?.name,
            },
          )
        }
      </Translation>,
      true,
    );
    console.info('SUCCESS');

    onClose();
  });
  const { detachVolume, isPending: isDetachPending } = useDetachVolume({
    onError: onTrackingBannerError,
    onSuccess: onTrackingBannerSuccess,
  });

  const isPending = isInstancesPending || isDetachPending;

  // redirect to listing if volume is not attached
  useEffect(() => {
    if (!isPending && !!volume) {
      if (volume.attachedTo.length === 0) {
        console.info('USE EFFECT');

        onClose();
      }
    }
  }, [navigate, projectId, volume, isPending]);

  return (
    <Form
      schema={DETACH_SCHEMA}
      onSubmit={(formData) =>
        // console.log({ formData })
        detachVolume({
          ...formData,
          projectId,
          volumeId,
        })
      }
      values={{
        instanceId:
          !!volume && volume.attachedTo.length === 1
            ? volume.attachedTo[0]
            : null,
      }}
    >
      <OsdsModal
        headline={t('pci_projects_project_storages_blocks_block_detach_title')}
        onOdsModalClose={onClose}
      >
        <slot name="content">
          {isPending && (
            <OsdsSpinner
              inline
              size={ODS_SPINNER_SIZE.md}
              className="block text-center"
              data-testid="detachStorage-spinner"
            />
          )}
          {instances?.length > 1 && (
            <div>
              <SelectInstance instances={instances} />
            </div>
          )}
          {!!instances && (
            <div className="mt-5">
              <InstanceDescription volume={volume} instances={instances} />
            </div>
          )}
        </slot>
        <ButtonLink
          slot="actions"
          color="primary"
          variant="ghost"
          to=".."
          actionName="cancel"
          actionValues={actionValues}
        >
          {t('pci_projects_project_storages_blocks_block_detach_cancel_label')}
        </ButtonLink>
        <SubmitButton
          label={t(
            'pci_projects_project_storages_blocks_block_detach_submit_label',
          )}
          region={volume?.region}
        />
      </OsdsModal>
    </Form>
  );
}
