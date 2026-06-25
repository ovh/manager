import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BaseLayout,
  ManagerButton,
  useAuthorizationIam,
} from '@ovh-ux/manager-react-components';
import { useVcdOrganization , PreparedVcdaOrder } from '@ovh-ux/manager-module-vcd-api';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import {
  OdsButton,
  OdsCard,
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { RhfField } from '@/components/Fields';
import {
  useCheckoutVcdaOrder,
  usePrepareVcdaOrder,
} from '@/data/hooks/vcdaOrder/useOrderVcda.hook';
import { useMessageContext } from '@/context/Message.context';
import { urls, subRoutes } from '@/routes/routes.constant';
import { iamActions } from '@/utils/iam.constants';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';
import { OrderFormSchema, OrderFormValues } from '../order.schema';

/** Passed to the contracts/terms step via the router Outlet context. */
export interface MigrationOrderTermsContext {
  prepared: PreparedVcdaOrder | null;
  isSubmitting: boolean;
  isError: boolean;
  onConfirm: () => void;
  clearPrepared: () => void;
}

export default function MigrationOrderContent() {
  const { t } = useTranslation('migration/order');
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { addSuccess } = useMessageContext();

  const dashboardUrl = urls.dashboard.replace(':id', id ?? '');

  const { data: organization } = useVcdOrganization({ id });
  const orgUrn = organization?.data?.iam?.urn;

  const { isAuthorized } = useAuthorizationIam(
    [iamActions.vmwareCloudDirectorApiovhMigrationCreate],
    orgUrn ?? '',
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    mode: 'onChange',
    defaultValues: { initialWhitelistCidr: '' },
  });

  const goToDashboard = () => navigate(dashboardUrl);

  const [prepared, setPrepared] = useState<PreparedVcdaOrder | null>(null);

  const { prepareVcda, isPending, isError, reset } = usePrepareVcdaOrder({
    orgId: id ?? '',
    organization: organization?.data,
  });

  const {
    checkoutVcda,
    isPending: isCheckingOut,
    isError: isCheckoutError,
  } = useCheckoutVcdaOrder({
    orgId: id ?? '',
    onSuccess: () => {
      addSuccess({
        content: t('managed_vcd_migration_order_success_banner_body'),
        isDismissible: true,
        includedSubRoutes: [id ?? ''],
        excludedSubRoutes: [subRoutes.migrationOrder],
      });
      goToDashboard();
    },
  });

  const onSubmit = handleSubmit((values) => {
    trackClick(TRACKING.dashboard.orderMigration);
    prepareVcda(
      { initialWhitelistCidr: values.initialWhitelistCidr },
      {
        onSuccess: (result) => {
          setPrepared(result);
          navigate(subRoutes.migrationOrderTerms);
        },
      },
    );
  });

  const onConfirmTerms = () => {
    if (prepared) checkoutVcda(prepared.cartId);
  };

  const clearPrepared = () => setPrepared(null);

  const onCancel = () => {
    trackClick(TRACKING.dashboard.orderMigrationCancel);
    goToDashboard();
  };

  const isOrderDisabled = !isValid || isPending || !isAuthorized;

  return (
    <BaseLayout breadcrumb={<Breadcrumb />}>
      <form onSubmit={onSubmit} aria-busy={isPending} className="flex flex-col">
        <div className="mb-6 flex flex-col gap-2">
          <OdsText preset={ODS_TEXT_PRESET.heading1}>
            {t('managed_vcd_migration_order_title')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('managed_vcd_migration_order_subtitle')}
          </OdsText>
        </div>

        <OdsCard
          className="mb-6 p-6 flex flex-col gap-2 w-full"
          aria-labelledby="vcda-order-solution-title"
          data-testid={TEST_IDS.migrationOrderSolutionSection}
        >
          <OdsText
            id="vcda-order-solution-title"
            preset={ODS_TEXT_PRESET.heading2}
          >
            {t('managed_vcd_migration_order_solution_title')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('managed_vcd_migration_order_solution_body')}
          </OdsText>
        </OdsCard>

        <OdsCard
          className="mb-6 p-6 flex flex-col gap-4 w-full"
          aria-labelledby="vcda-order-infra-title"
        >
          <OdsText
            id="vcda-order-infra-title"
            preset={ODS_TEXT_PRESET.heading2}
          >
            {t('managed_vcd_migration_order_infrastructure_title')}
          </OdsText>
          <RhfField
            controllerParams={register('initialWhitelistCidr')}
            control={(control as unknown) as Control<FieldValues>}
            errorMessage={
              errors.initialWhitelistCidr
                ? t(errors.initialWhitelistCidr.message ?? '')
                : undefined
            }
          >
            <RhfField.Label>
              {t('managed_vcd_migration_order_ip_label')}
            </RhfField.Label>
            <RhfField.Input
              type="text"
              isDisabled={isPending}
              placeholder="xxx.xxx.xxx.xxx/32"
            />
            <RhfField.HelperAuto
              helperMessage={t('managed_vcd_migration_order_ip_helper')}
            />
          </RhfField>
          <OdsText preset={ODS_TEXT_PRESET.caption}>
            {t('managed_vcd_migration_order_email_confirmation')}
          </OdsText>
        </OdsCard>

        {isError && (
          <OdsMessage
            color="danger"
            isDismissible
            onOdsRemove={reset}
            className="mb-4"
            data-testid={TEST_IDS.migrationOrderError}
          >
            {t('managed_vcd_migration_order_error_submit')}
          </OdsMessage>
        )}

        <div className="flex items-center gap-x-4">
          <OdsButton
            type="button"
            variant={ODS_BUTTON_VARIANT.ghost}
            label={t('managed_vcd_migration_order_cancel')}
            isDisabled={isPending || undefined}
            onClick={onCancel}
            data-testid={TEST_IDS.migrationOrderCancelCta}
          />
          <ManagerButton
            id="migration-order-submit"
            type="submit"
            label={t('managed_vcd_migration_order_order')}
            iamActions={[iamActions.vmwareCloudDirectorApiovhMigrationCreate]}
            urn={orgUrn}
            displayTooltip={!isAuthorized}
            isDisabled={isOrderDisabled || undefined}
            data-testid={TEST_IDS.migrationOrderSubmitCta}
          >
            {isPending && (
              <OdsSpinner slot="start" size={ODS_SPINNER_SIZE.xs} />
            )}
          </ManagerButton>
        </div>
      </form>

      <Outlet
        context={
          {
            prepared,
            isSubmitting: isCheckingOut,
            isError: isCheckoutError,
            onConfirm: onConfirmTerms,
            clearPrepared,
          } as MigrationOrderTermsContext
        }
      />
    </BaseLayout>
  );
}
