import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button, useToast } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';
import { useAddLifecycle } from '@/data/hooks/lifecycle/useAddLifecycle.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { LifecycleForm } from '../_components/form/LifecycleForm.component';
import { buildLifecycleRule } from '../_components/form/buildLifecycleRule';
import { useLifecycleForm } from '../_components/form/useLifecycleForm.hook';
import { PayloadPreview } from '../_components/form/PayloadPreview.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import LinkComponent from '@/components/links/Link.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="formAddBreadcrumb"
      namespace="pci-object-storage/storages/s3/lifecycle"
    />
  );
}

const CreateLifecycle = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');
  const { s3 } = useS3Data();
  const toast = useToast();
  const navigate = useNavigate();
  const { form } = useLifecycleForm({});
  const { projectId } = useParams();

  const { addLifecycle, isPending } = useAddLifecycle({
    onError: (err) => {
      toast.toast({
        title: t('formAddToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('formAddToastSuccessTitle'),
        description: t('formAddToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const lifecycleRule = buildLifecycleRule(formValues);
    if (!lifecycleRule || !s3?.region || !s3?.name) return;

    addLifecycle({
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
        lifecycleTitle={t('formAddTitle')}
        form={form}
        isPending={isPending}
        onSubmit={onSubmit}
      />
      <div className="flex gap-2 mt-4">
        <Button
          data-testid="add-lifecycle-cancel-button"
          type="button"
          mode="ghost"
          onClick={() => navigate('../')}
        >
          {t('formButtonCancel')}
        </Button>
        <Button type="submit" disabled={isPending} form="lifecycle-form">
          {t('formButtonConfirm')}
        </Button>
      </div>
      <PayloadPreview form={form} />
    </>
  );
};

export default CreateLifecycle;
