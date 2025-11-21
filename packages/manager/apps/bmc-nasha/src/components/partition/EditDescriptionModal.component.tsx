import { useTranslation } from 'react-i18next';

import { Button, Input, Modal } from '@ovh-ux/muk';

import { FormField } from '@/components/form-field/FormField.component';
import { useEditDescriptionForm } from '@/hooks/partitions/useEditDescriptionForm';

const DESCRIPTION_MAX = 50;

type EditDescriptionModalProps = {
  isOpen: boolean;
  partitionName?: string;
  currentDescription: string;
  serviceName?: string;
  partitionDescription?: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export function EditDescriptionModal({
  isOpen,
  partitionName,
  currentDescription,
  serviceName,
  partitionDescription,
  onSuccess,
  onCancel,
}: EditDescriptionModalProps) {
  const { t } = useTranslation(['partition']);

  const { form, handleSubmit, isSubmitting } = useEditDescriptionForm({
    serviceName,
    partitionName,
    partitionDescription,
    isModalOpen: isOpen,
    onSuccess,
  });

  const isDirty = form.watch('description') !== currentDescription;

  return (
    <Modal
      open={isOpen}
      onOpenChange={onCancel}
      dismissible={true}
      heading={t('partition:edit_description.title', `Edit description for ${partitionName || ''}`)}
    >
      <form id="editDescriptionForm" onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <FormField
          form={form}
          name="description"
          label={t('partition:edit_description.label', 'Description')}
          helper={t('partition:edit_description.helper', `Maximum ${DESCRIPTION_MAX} characters`)}
        >
          {(field) => (
            <Input
              {...field}
              type="text"
              maxLength={DESCRIPTION_MAX}
              disabled={isSubmitting}
              required
            />
          )}
        </FormField>

        <div className="flex gap-4 justify-end mt-6">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            {t('partition:edit_description.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            form="editDescriptionForm"
            variant="default"
            disabled={isSubmitting || !isDirty}
            loading={isSubmitting}
          >
            {t('partition:edit_description.confirm', 'Confirm')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
