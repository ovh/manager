import {
  OsdsMessage,
  OsdsText,
  OsdsIcon,
  OsdsLink,
} from '@ovhcloud/ods-components/react';

import { OdsHTMLAnchorElementTarget as AnchorTarget } from '@ovhcloud/ods-common-core';

import {
  ODS_THEME_COLOR_INTENT as ColorIntent,
  ODS_THEME_TYPOGRAPHY_LEVEL as TypographyLevel,
  ODS_THEME_TYPOGRAPHY_SIZE as TypographySize,
} from '@ovhcloud/ods-common-theming';

import {
  ODS_ICON_NAME as IconName,
  ODS_ICON_SIZE as IconSize,
  ODS_MESSAGE_TYPE as MessageType,
  ODS_TEXT_COLOR_INTENT as TextColorIntent,
} from '@ovhcloud/ods-components';

import { useTranslation } from 'react-i18next';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { TGateway } from '@/api/data/subnets';
import { isValidGateway3AZ } from '@/pages/new/steps/NetworkClusterStep.component';
import { DeploymentMode } from '@/types';
import { TNetworkRegion } from '@/api/data/network';

type Props = {
  network: TNetworkRegion[];
  gateways: TGateway[];
  type: DeploymentMode;
};

const NoGatewayLinkedMessage = ({ network, gateways, type }: Props) => {
  const { t } = useTranslation(['network-add', 'service']);
  const projectURL = useProjectUrl('public-cloud');
  const privateNetworkURL = `${projectURL}/private-networks`;

  const noNetwork = !network.length;
  const invalidGateway = gateways && !isValidGateway3AZ(type, gateways);

  const messageText = useMemo(() => {
    if (noNetwork) {
      return t('kubernetes_network_form_no_private_network');
    }
    if (invalidGateway) {
      return t('kubernetes_network_form_no_associated_gateway');
    }
    return '';
  }, [noNetwork, invalidGateway, t]);

  if (!messageText) return null;

  return (
    <OsdsMessage
      type={MessageType.warning}
      color={TextColorIntent.warning}
      className="flex my-2"
    >
      <div>
        <OsdsText
          level={TypographyLevel.body}
          size={TypographySize._400}
          color={ColorIntent.text}
        >
          {messageText}{' '}
        </OsdsText>
        <OsdsLink
          target={AnchorTarget._blank}
          color={ColorIntent.primary}
          href={privateNetworkURL}
        >
          {t('kubernetes_network_form_add')}
          <OsdsIcon
            className="ml-5"
            aria-hidden="true"
            name={IconName.ARROW_RIGHT}
            size={IconSize.xxs}
            color={ColorIntent.primary}
          />
        </OsdsLink>
      </div>
    </OsdsMessage>
  );
};

export default NoGatewayLinkedMessage;
