import { PciModal, useParam } from '@ovh-ux/manager-pci-common';
import {
  Links,
  LinkType,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { INSTANCE_PRICING_LINKS } from '@/constants';
import { useActivateMonthlyBilling } from '@/api/hook/useConsumption';

export default function ActivateMonthlyBilling() {
  const { t } = useTranslation(
    'consumption/hourly-instance/activate-monthly-billing',
  );
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { projectId } = useParam('projectId');
  const [searchParams] = useSearchParams();
  const instanceId = searchParams.get('instanceId');

  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();

  const instancePricesLink =
    INSTANCE_PRICING_LINKS[ovhSubsidiary] || INSTANCE_PRICING_LINKS.DEFAULT;

  const { activateMonthlyBilling, isPending } = useActivateMonthlyBilling({
    projectId,
    onSuccess: () => {
      addSuccess(
        t(
          'pci_projects_project_instances_instance_active-monthly-billing_success_message',
          {
            instance: instanceId,
          },
        ),
        true,
      );
      navigate('..');
    },
    onError: () => {
      addError(
        t(
          'pci_projects_project_instances_instance_active-monthly-billing_error_enable',
          {
            instance: instanceId,
          },
        ),
        true,
      );
      navigate('..');
    },
  });

  const onConfirm = () => activateMonthlyBilling(instanceId);

  return (
    <PciModal
      title={t(
        'pci_projects_project_instances_instance_active-monthly-billing_title',
      )}
      isPending={isPending}
      isDisabled={isPending}
      onConfirm={onConfirm}
      onClose={() => navigate('..')}
      onCancel={() => navigate('..')}
      submitText={t(
        'pci_projects_project_instances_instance_active-monthly-billing_submit_label',
      )}
      cancelText={t(
        'pci_projects_project_instances_instance_active-monthly-billing_cancel_label',
      )}
    >
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {t(
          'pci_projects_project_instances_instance_active-monthly-billing_content',
        )}
      </OsdsText>
      <Links
        type={LinkType.external}
        href={instancePricesLink}
        label={t(
          'pci_projects_project_instances_instance_active-monthly-billing_content_link',
        )}
        target={OdsHTMLAnchorElementTarget._blank}
      />
      <OsdsMessage
        color={ODS_THEME_COLOR_INTENT.warning}
        icon={ODS_ICON_NAME.WARNING}
        className="mt-6"
      >
        {t(
          'pci_projects_project_instances_instance_active-monthly-billing_invoice_alert',
        )}
      </OsdsMessage>
    </PciModal>
  );
}
