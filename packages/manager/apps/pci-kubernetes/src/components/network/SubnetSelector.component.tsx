import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_SELECT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useKubeNetwork } from './useKubeNetwork';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';

export interface SubnetSelectorProps {
  projectId: string;
  kubeId: string;
  disabled?: boolean;
  className?: string;
  title: string;
  preselectedId?: string;
  onSelect?: (network?: TPrivateNetworkSubnet) => void;
}

export const SubnetSelector = ({
  projectId,
  kubeId,
  disabled,
  className,
  title,
  preselectedId,
  onSelect,
}: Readonly<SubnetSelectorProps>) => {
  const [subnet, setSubnet] = useState({ id: 'none' });
  const { t: tCommon } = useTranslation('common');
  const { availableSubnets, isPending } = useKubeNetwork({
    projectId,
    kubeId,
  });

  useEffect(() => {
    if (preselectedId) {
      setSubnet(availableSubnets.find((net) => net.id === preselectedId));
    }
  }, [availableSubnets]);

  if (isPending) return <OsdsSkeleton className={className} />;

  return (
    <OsdsFormField className={className}>
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._200}
        color={ODS_THEME_COLOR_INTENT.text}
        slot="label"
      >
        {title}
      </OsdsText>
      <OsdsSelect
        name="subnet"
        size={ODS_SELECT_SIZE.md}
        value={subnet?.id}
        onOdsValueChange={({ detail }) => {
          const sub = availableSubnets.find((net) => net.id === detail.value);
          setSubnet(sub || { id: 'none' });
          onSelect?.(sub);
        }}
        disabled={disabled || undefined}
      >
        <OsdsSelectOption key="none" value="none">
          {tCommon('common_none')}
        </OsdsSelectOption>
        {availableSubnets.map((sub) => (
          <OsdsSelectOption key={sub.id} value={sub.id}>
            {sub.id}
            {' - '}
            {sub.cidr}
          </OsdsSelectOption>
        ))}
      </OsdsSelect>
    </OsdsFormField>
  );
};
