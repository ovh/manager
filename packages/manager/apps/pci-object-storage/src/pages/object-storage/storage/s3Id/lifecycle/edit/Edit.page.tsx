import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button, Skeleton, useToast } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';
import { useUpdateLifecycle } from '@/data/hooks/lifecycle/useUpdateLifecycle.hook';
import { useGetS3Lifecycle } from '@/data/hooks/s3-storage/useGetS3Lifecycle.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { LifecycleForm } from '../_components/form/LifecycleForm.component';
import { buildLifecycleRule } from '../_components/form/buildLifecycleRule';
import { useLifecycleForm } from '../_components/form/useLifecycleForm.hook';
import { PayloadPreview } from '../_components/form/PayloadPreview.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import LinkComponent from '@/components/links/Link.component';
import { useLifecycleAvailableStorageClasses } from '../_components/form/useLifecycleAvailableStorageClasses.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="formEditBreadcrumb"
      namespace="pci-object-storage/storages/s3/lifecycle"
    />
  );
}

const EditLifecycleContent = ({
  existingRule,
}: {
  existingRule: Parameters<typeof useLifecycleForm>[0]['existingRule'];
}) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');
  const { s3 } = useS3Data();
  const toast = useToast();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { availableStorageClasses } = useLifecycleAvailableStorageClasses(
    s3?.region ?? '',
  );

  const { form } = useLifecycleForm({ existingRule });

  const { updateLifecycle, isPending } = useUpdateLifecycle({
    onError: (err) => {
      toast.toast({
        title: t('formEditToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('formEditToastSuccessTitle'),
        description: t('formEditToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const lifecycleRule = buildLifecycleRule(formValues);
    if (!lifecycleRule || !s3?.region || !s3?.name) return;

    updateLifecycle({
      projectId,
      region: s3.region,
      name: s3.name,
      lifecycleRule,
    });
  });

  return (
    <>
      <LinkComponent to="../" className="flex items-center gap-2 mb-4">
        <ArrowLeft className="size-4" />
        {t('formBackLink')}
      </LinkComponent>
      <LifecycleForm
        isEditMode
        lifecycleTitle={t('formEditTitle')}
        form={form}
        isPending={isPending}
        availableStorageClasses={availableStorageClasses}
        onSubmit={onSubmit}
      />
      <div className="flex gap-2 mt-4">
        <Button
          data-testid="edit-lifecycle-cancel-button"
          type="button"
          mode="ghost"
          onClick={() => navigate('../')}
        >
          {t('formButtonCancel')}
        </Button>
        <Button
          type="submit"
          disabled={isPending || !form.formState.isValid}
          form="lifecycle-form"
        >
          {t('formEditButtonConfirm')}
        </Button>
      </div>
      <PayloadPreview form={form} />
    </>
  );
};

const EditLifecycle = () => {
  const { projectId, region, s3Name, ruleId } = useParams();

  const lifecycleQuery = useGetS3Lifecycle({
    projectId,
    region,
    name: s3Name,
  });

  if (lifecycleQuery.isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const existingRule = lifecycleQuery.data?.rules?.find((r) => r.id === ruleId);

  return <EditLifecycleContent existingRule={existingRule} />;
};

export default EditLifecycle;
