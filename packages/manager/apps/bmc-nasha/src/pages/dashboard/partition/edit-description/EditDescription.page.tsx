import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Button, FormField, FormFieldHelper, FormFieldLabel, Input } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import { useEditDescriptionPageForm } from '@/hooks/partitions/useEditDescriptionPageForm';
import { usePartitionDetail } from '@/hooks/partitions/usePartitionDetail';

const DESCRIPTION_MAX = 50;

export default function EditDescriptionPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['common', 'partition']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: partition, isLoading } = usePartitionDetail(serviceName ?? '', partitionName ?? '');

  const { form, handleSubmit, isSubmitting, isDirty } = useEditDescriptionPageForm({
    serviceName,
    partitionName,
    initialDescription: partition?.partitionDescription,
    onSuccess: () => {
      // Navigate back to partition detail with success using relative path
      void navigate('..', {
        replace: true,
        state: {
          success: t('partition:edit_description.success', 'Description updated successfully'),
        },
      });
    },
  });

  const handleCancel = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-description', 'cancel'],
    });
    // Navigate back to partition detail using relative path
    void navigate('..', { replace: true });
  };

  const onSubmit = async () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-description', 'confirm'],
    });

    try {
      await handleSubmit();
    } catch {
      // Error handled by form
    }
  };

  if (isLoading || !partition) {
    return <div>Loading...</div>;
  }

  return (
    <BaseLayout
      header={{
        title: t('partition:edit_description.title', 'Edit description'),
      }}
    >
      <div className="mb-4 text-sm text-gray-600">{partitionName}</div>
      <form onSubmit={void handleSubmit} className="max-w-2xl">
        <FormField>
          <FormFieldLabel>{t('partition:edit_description.label', 'Description')}</FormFieldLabel>
          <Input
            type="text"
            {...form.register('description')}
            maxLength={DESCRIPTION_MAX}
            disabled={isSubmitting}
            required
          />
          <FormFieldHelper>
            {t('partition:edit_description.helper', `Maximum ${DESCRIPTION_MAX} characters`)}
          </FormFieldHelper>
          {form.formState.errors.description && (
            <FormFieldHelper className="text-red-600">
              {form.formState.errors.description.message}
            </FormFieldHelper>
          )}
        </FormField>

        <div className="mt-6 flex gap-4">
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || !isDirty}
            loading={isSubmitting}
            onClick={void onSubmit}
          >
            {t('partition:edit_description.confirm', 'Confirm')}
          </Button>
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
            {t('partition:edit_description.cancel', 'Cancel')}
          </Button>
        </div>
      </form>
    </BaseLayout>
  );
}
