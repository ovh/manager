import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  MODAL_COLOR,
  Modal,
  ModalBody,
  ModalContent,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button as IAMButton, useNotifications } from '@ovh-ux/muk';

import ErrorMessage from '@/components/error/ErrorMessage.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useEditObservabilityService } from '@/data/hooks/services/useEditObservabilityService.hook';
import { useServiceFormSchema } from '@/hooks/form/useServiceFormSchema.hook';
import { ObservabilityServiceFormData } from '@/types/observability.type';
import { IAM_ACTIONS } from '@/utils/iam.constants';

export default function ServiceEditPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['services', NAMESPACES.ACTIONS, NAMESPACES.DASHBOARD]);
  const { addSuccess, addError } = useNotifications();
  const { selectedService } = useObservabilityServiceContext();

  const resourceName = selectedService?.id ?? '';
  const currentDisplayName = selectedService?.currentState?.displayName ?? resourceName;

  const { form } = useServiceFormSchema(currentDisplayName);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = form;

  const { mutate: editService, isPending } = useEditObservabilityService({
    onSuccess: (_, variables) => {
      addSuccess(t('services:edit.success', { serviceName: variables.targetSpec.displayName }));
      handleClose();
    },
    onError: (error) => {
      addError(<ErrorMessage error={error} />);
    },
  });

  const handleClose = () => navigate(-1);

  const onSubmit = (data: ObservabilityServiceFormData) => {
    editService({ resourceName, targetSpec: { displayName: data.displayName } });
  };

  const isSubmitDisabled = isPending || !isDirty || !isValid;

  return (
    <Modal open>
      <ModalContent color={MODAL_COLOR.information} dismissible={false}>
        <ModalBody className="flex flex-col gap-y-4 pt-6">
          <Text preset={TEXT_PRESET.heading4}>{t('services:edit.title')}</Text>

          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <FormField className="w-full" invalid={!!errors.displayName}>
              <FormFieldLabel htmlFor="service-name">
                <Text preset={TEXT_PRESET.paragraph}>{t(`${NAMESPACES.DASHBOARD}:name`)}</Text>
              </FormFieldLabel>
              <Input
                id="service-name"
                {...register('displayName')}
                placeholder={t(`${NAMESPACES.DASHBOARD}:name`)}
                disabled={isPending}
                invalid={!!errors.displayName}
              />
              {errors.displayName && (
                <FormFieldError>
                  <Text preset={TEXT_PRESET.label} className="text-[--ods-color-error-500]">
                    {errors.displayName.message}
                  </Text>
                </FormFieldError>
              )}
            </FormField>

            <div className="flex justify-end gap-2 pt-6">
              <Button
                data-testid="cancel-button"
                color={BUTTON_COLOR.primary}
                onClick={handleClose}
                variant={BUTTON_VARIANT.ghost}
                type="button"
              >
                {t(`${NAMESPACES.ACTIONS}:cancel`)}
              </Button>

              <IAMButton
                data-testid="confirm-button"
                color={BUTTON_COLOR.primary}
                type="submit"
                disabled={isSubmitDisabled}
                loading={isPending}
                variant={BUTTON_VARIANT.default}
                iamActions={IAM_ACTIONS.EDIT_SERVICE}
                urn={selectedService?.iam?.urn}
              >
                {t(`${NAMESPACES.ACTIONS}:modify`)}
              </IAMButton>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
