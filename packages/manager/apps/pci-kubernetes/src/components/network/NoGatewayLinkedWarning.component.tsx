import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

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
import { OsdsIcon, OsdsLink, OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

import { useProjectUrl } from '@ovh-ux/manager-react-components';

import { TNetworkRegion } from '@/api/data/network';
import { TGateway } from '@/api/data/subnets';
import { isStandardPlan } from '@/helpers';
import { isValidGateway } from '@/helpers/networks';
import { TClusterPlanEnum } from '@/types';

type Props = {
  network?: TNetworkRegion[];
  gateways: TGateway[];
  plan?: TClusterPlanEnum;
};

const NoGatewayLinkedMessage = ({ network, gateways, plan }: Props) => {
  const { t } = useTranslation(['network-add', 'service']);
  const projectURL = useProjectUrl('public-cloud');
  const privateNetworkURL = `${projectURL}/private-networks`;
  const createPrivateGatewayURL = `${projectURL}/gateway/new`;
  const noNetwork = !network?.length;
  const invalidGateway = gateways && plan && isStandardPlan(plan) && !isValidGateway(gateways);

  const content = useMemo(() => {
    if (noNetwork) {
      return {
        text: t('kubernetes_network_form_no_private_network'),
        link: t('kubernetes_network_form_add'),
        url: privateNetworkURL,
      };
    }
    if (invalidGateway) {
      return {
        text: t('kubernetes_network_form_no_associated_gateway'),
        link: t('kubernetes_network_form_add_gateway'),
        url: createPrivateGatewayURL,
      };
    }
    return null;
  }, [noNetwork, invalidGateway, t, privateNetworkURL, createPrivateGatewayURL]);

  if (!content) return null;

  return (
    <OsdsMessage type={MessageType.warning} color={TextColorIntent.warning} className="my-2 flex">
      <div>
        <OsdsText level={TypographyLevel.body} size={TypographySize._400} color={ColorIntent.text}>
          {content.text}{' '}
        </OsdsText>
        <OsdsLink target={AnchorTarget._blank} color={ColorIntent.primary} href={content.url}>
          {content.link}
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
