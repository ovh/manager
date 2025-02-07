import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_SIZE,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useTranslation, Trans } from 'react-i18next';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import useGuideLink from '@/hooks/useGuideLink/useGuideLink';
import useGetExistingGatewayRegion from '@/hooks/useExistingGatewayRegion/useExistingGatewayRegion';
import AvailableGatewayMessage from '../message/AvailableGatewayMessage.component';
import ExistingGatewayMessage from '../message/ExistingGatewayMessage.component';
import usePrepareGatewayCreation from '@/hooks/usePrepareGatewayCreation/usePrepareGatewayCreation';
import { useSmallestGatewayByRegion } from '@/hooks/useAvailableGateway/useAvailableGateway';

const GatewayCreation: React.FC = () => {
  const { t } = useTranslation(['new', 'common']);
  const guides = useGuideLink();
  const { watch, unregister } = useFormContext<NewPrivateNetworkForm>();
  const region = watch('region');

  const {
    isLoading: isCatalogLoading,
    data: catalog,
  } = useSmallestGatewayByRegion(region);

  const {
    gateway,
    isLoading: isExistingGatewayLoading,
  } = useGetExistingGatewayRegion(region);

  const [createGateway, setCreateGateway] = useState<boolean>(false);

  usePrepareGatewayCreation({
    createGateway,
    searching: isExistingGatewayLoading,
    gateway,
    catalog,
    region,
  });

  const renderGatewayMessage = () => {
    if (isCatalogLoading || isExistingGatewayLoading) {
      return <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />;
    }

    return gateway ? (
      <ExistingGatewayMessage gateway={gateway} />
    ) : (
      <AvailableGatewayMessage
        size={catalog?.size.toUpperCase()}
        price={catalog?.price}
      />
    );
  };

  useEffect(() => {
    // unregister snat every time region or gateway change
    unregister('enableSnat');
  }, [region, gateway, createGateway]);

  return (
    <>
      <OsdsCheckbox
        data-testid="create-public-gateway"
        name="create-public-gateway"
        checked={createGateway}
        disabled={!gateway && !catalog}
        onOdsCheckedChange={(event: CustomEvent) =>
          setCreateGateway(event.detail.checked)
        }
      >
        <OsdsCheckboxButton
          interactive
          size={ODS_CHECKBOX_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          <OsdsText
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            slot="end"
          >
            {t('pci_projects_project_network_private_create_public_gateway')}
          </OsdsText>
        </OsdsCheckboxButton>
      </OsdsCheckbox>
      {createGateway && renderGatewayMessage()}
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        slot="end"
      >
        <Trans
          t={t}
          i18nKey="pci_projects_project_network_private_create_public_gateway_decription_1"
          components={{
            link: (
              <Links
                label={t('common:common_click_here_btn')}
                href={guides.PRIVATE_NETWORK_WITH_GATEWAY}
                target={OdsHTMLAnchorElementTarget._blank}
              />
            ),
          }}
        />
      </OsdsText>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        slot="end"
      >
        {t('pci_projects_project_network_private_create_public_gateway_footer')}
        <Links
          label={t('common:common_click_here_btn')}
          href={guides.REGION_AVAILABILITY}
          target={OdsHTMLAnchorElementTarget._blank}
          type={LinkType.next}
        />
      </OsdsText>
    </>
  );
};

export default GatewayCreation;
