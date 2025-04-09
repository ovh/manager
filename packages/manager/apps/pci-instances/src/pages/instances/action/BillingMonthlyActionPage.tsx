import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { FC, useContext, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { useBaseInstanceAction } from '@/data/hooks/instance/action/useInstanceAction';

import { TRescueActionPageProps } from './RescueAction.page';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';

export const INSTANCE_PRICING_LINKS = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/prices',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/prices',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/prices',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/prices',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/prices',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/prices',
  IN: 'https://www.ovhcloud.com/en-in/public-cloud/prices',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices',
  WS: 'https://www.ovhcloud.com/es/public-cloud/prices',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices',
};

type TBillingMonthlyActionPageProps = Omit<
  TRescueActionPageProps,
  'section'
> & {
  section: 'billing/monthly/activate';
};

const BillingMonthlyActionPage: FC<TBillingMonthlyActionPageProps> = ({
  title,
  handleModalClose,
  section,
  instance,
  projectId,
  onError,
  onSuccess,
}) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const { mutationHandler, isPending } = useBaseInstanceAction(
    section,
    projectId,
    {
      onError,
      onSuccess,
    },
  );
  const handleInstanceAction = () => mutationHandler(instance);

  const pricingHref = useMemo(() => {
    return ovhSubsidiary
      ? INSTANCE_PRICING_LINKS[
          ovhSubsidiary as keyof typeof INSTANCE_PRICING_LINKS
        ]
      : INSTANCE_PRICING_LINKS.DEFAULT;
  }, [ovhSubsidiary]);

  return (
    <ActionModal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      handleModalClose={handleModalClose}
      instanceName={instance.name}
      section={section}
    >
      <>
        <Trans
          key="0"
          i18nKey={`pci_instances_actions_billing_monthly_activate_instance_confirmation_message`}
          ns={'actions'}
          components={[
            <OsdsLink
              key="0"
              color={ODS_THEME_COLOR_INTENT.primary}
              href={pricingHref}
              dir="ltr"
            />,
          ]}
        />
        <OsdsIcon
          slot="end"
          className="ml-4"
          name={ODS_ICON_NAME.EXTERNAL_LINK}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </>
    </ActionModal>
  );
};

export default BillingMonthlyActionPage;
