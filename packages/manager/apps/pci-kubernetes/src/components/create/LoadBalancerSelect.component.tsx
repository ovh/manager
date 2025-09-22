import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';

import { TNetworkRegion } from '@/api/data/network';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';

import { SubnetSelector } from '../network/SubnetSelector.component';

export type LoadBalancerSelectProps = {
  projectId: string;
  network: TNetworkRegion;
  onSelect: (network: TPrivateNetworkSubnet) => void;
  region: string;
};

export default function LoadBalancerSelect({
  projectId,
  network,
  onSelect,
  region,
}: Readonly<LoadBalancerSelectProps>) {
  const { t } = useTranslation('network-add');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="block my-8 flex items-center"
        onClick={() => setIsExpanded((e) => !e)}
      >
        <>
          {t('kubernetes_network_form_load_balancers_subnet_toggler')}
          <OsdsIcon
            name={isExpanded ? ODS_ICON_NAME.CHEVRON_UP : ODS_ICON_NAME.CHEVRON_DOWN}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.sm}
            aria-hidden="true"
            className="ml-4"
          />
        </>
      </OsdsText>

      <div className={isExpanded ? 'block' : 'hidden'}>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._300}
          className="block mb-5"
        >
          {t('kubernetes_network_form_load_balancers_subnet')}
        </OsdsText>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('kubernetes_network_form_load_balancers_subnet_description')}
        </OsdsText>
        <SubnetSelector
          className="mt-6"
          title={t('kubernetes_network_form_load_balancers_subnet')}
          projectId={projectId}
          networkId={network?.id}
          region={region}
          onSelect={onSelect}
          allowsEmpty
        />
      </div>
    </div>
  );
}
