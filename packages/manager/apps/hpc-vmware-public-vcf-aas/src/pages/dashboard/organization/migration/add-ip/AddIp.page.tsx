import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsInput,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { useMessageContext } from '@/context/Message.context';
import TEST_IDS from '@/utils/testIds.constants';
import {
  AddIpFormSchema,
  AddIpFormValues,
  isDuplicateHostIp,
  toHostIp,
} from '@/schemas/cidr.schema';
import { useUpdateVcdaWhitelist } from '@/data/hooks/vcda/useUpdateVcdaWhitelist.hook';
import { useMigrationContext } from '../Migration.context';

export default function AddIpPage() {
  const { t } = useTranslation('migration');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess } = useMessageContext();
  const { orgId, migrationId, whitelist } = useMigrationContext();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<AddIpFormValues>({
    resolver: zodResolver(AddIpFormSchema),
    mode: 'onChange',
    defaultValues: { cidr: '' },
  });

  const { mutate: updateWhitelist, error, isPending } = useUpdateVcdaWhitelist({
    orgId,
    migrationId,
    onSuccess: () => {
      addSuccess({
        content: t('migration.addModal.toast.success'),
        includedSubRoutes: [orgId],
        duration: 5000,
      });
      closeModal();
    },
  });

  const currentIps = whitelist.map((entry) => entry.ip);

  const onSubmit = handleSubmit(({ cidr }) => {
    const hostIp = toHostIp(cidr);
    if (isDuplicateHostIp(hostIp, currentIps)) {
      setError('cidr', { message: 'migration.addModal.error.duplicate' });
      return;
    }
    updateWhitelist([...currentIps, hostIp]);
  });

  return (
    <Suspense>
      <Modal
        isOpen
        heading={t('migration.addModal.title')}
        onDismiss={closeModal}
        primaryLabel={t('migration.addModal.button.add')}
        onPrimaryButtonClick={onSubmit}
        isPrimaryButtonDisabled={!isValid || isPending}
        isPrimaryButtonLoading={isPending}
        secondaryLabel={tActions('cancel')}
        onSecondaryButtonClick={closeModal}
        primaryButtonTestId={TEST_IDS.migrationAddSubmitCta}
      >
        <div className="flex flex-col gap-4">
          {error && (
            <OdsMessage color="critical" isDismissible={false}>
              {t('migration.addModal.error.generic')}
            </OdsMessage>
          )}
          <Controller
            control={control}
            name="cidr"
            render={({ field }) => (
              <OdsFormField
                className="flex flex-col"
                error={errors.cidr ? t(errors.cidr.message ?? '') : undefined}
              >
                <label slot="label" htmlFor="migration-add-ip-input">
                  {t('migration.addModal.field.cidr.label')}
                </label>
                <OdsInput
                  id="migration-add-ip-input"
                  name={field.name}
                  value={field.value}
                  placeholder={t('migration.addModal.field.cidr.placeholder')}
                  hasError={!!errors.cidr}
                  isDisabled={isPending}
                  onOdsBlur={field.onBlur}
                  onOdsChange={field.onChange}
                />
              </OdsFormField>
            )}
          />
        </div>
      </Modal>
    </Suspense>
  );
}
