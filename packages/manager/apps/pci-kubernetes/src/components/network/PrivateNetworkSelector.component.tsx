import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_SELECT_SIZE, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { TNetworkRegion } from '@/api/data/network';

import { useKubeNetwork } from './useKubeNetwork';

export interface PrivateNetworkSelectorProps {
  projectId: string;
  kubeId: string;
  disabled?: boolean;
  className?: string;
  onSelect?: (network: TNetworkRegion) => void;
}

export const PrivateNetworkSelector = ({
  projectId,
  kubeId,
  disabled,
  className,
  onSelect,
}: Readonly<PrivateNetworkSelectorProps>) => {
  const [privateNetwork, setPrivateNetwork] = useState(null);
  const { t: tAdd } = useTranslation('network-add');
  const { availablePrivateNetworks, kubePrivateNetwork, isPending } = useKubeNetwork({
    projectId,
    kubeId,
  });

  useEffect(() => {
    setPrivateNetwork(kubePrivateNetwork);
  }, [kubePrivateNetwork]);

  if (isPending) return <OsdsSkeleton className={className} />;

  return (
    <OsdsFormField className={className}>
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._200}
        color={ODS_THEME_COLOR_INTENT.text}
        slot="label"
      >
        {tAdd('kubernetes_network_form_label')}
      </OsdsText>
      <OsdsSelect
        name="privateNetwork"
        size={ODS_SELECT_SIZE.md}
        value={privateNetwork?.id}
        onOdsValueChange={({ detail }) => {
          const network = availablePrivateNetworks.find((net) => net.id === detail.value);
          setPrivateNetwork(network);
          onSelect?.(network);
        }}
        disabled={disabled || undefined}
      >
        {availablePrivateNetworks.map((network) => (
          <OsdsSelectOption key={network.id} value={network.id}>
            {network.name}
          </OsdsSelectOption>
        ))}
      </OsdsSelect>
    </OsdsFormField>
  );
};
