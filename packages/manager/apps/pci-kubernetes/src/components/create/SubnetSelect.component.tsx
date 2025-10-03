import { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';

import { LinkType, Links } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { TNetworkRegion } from '@/api/data/network';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import { SUBNET_DOC } from '@/constants';

import { SubnetSelector } from '../network/SubnetSelector.component';

export type SubnetSelectProps = {
  projectId: string;
  privateNetwork: TNetworkRegion;
  onSelect: (subnet: TPrivateNetworkSubnet) => void;
  className?: string;
  region: string;
};

export default function SubnetSelect({
  projectId,
  privateNetwork,
  onSelect,
  region,
  className,
}: Readonly<SubnetSelectProps>) {
  const { t } = useTranslation('network-add');

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const subnetDocumentationLink = SUBNET_DOC[ovhSubsidiary] ?? SUBNET_DOC.DEFAULT;

  return (
    <div className={className}>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="block mb-5"
      >
        {t('kubernetes_network_form_subnet')}
      </OsdsText>
      <div className="mb-2">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          {t('kubernetes_network_form_subnet_description')}
        </OsdsText>
        <Links
          className="ml-3"
          href={subnetDocumentationLink}
          type={LinkType.external}
          label={t('kubernetes_network_form_subnet_link')}
        />
      </div>

      <SubnetSelector
        region={region}
        className="mt-2 w-full lg:w-1/2"
        projectId={projectId}
        networkId={privateNetwork.id}
        onSelect={onSelect}
        showSpinner
      />
    </div>
  );
}
