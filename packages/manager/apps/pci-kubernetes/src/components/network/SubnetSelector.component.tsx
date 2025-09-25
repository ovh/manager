import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_MESSAGE_TYPE,
  ODS_SELECT_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsMessage,
  OsdsSelectOption,
  OsdsSkeleton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import { useRegionSubnets } from '@/api/hooks/useSubnets';
import { SelectComponent } from '@/components/input/Select.component';

export interface SubnetSelectorProps {
  projectId: string;
  networkId: string;
  region: string;
  disabled?: boolean;
  allowsEmpty?: boolean;
  className?: string;
  title?: string;
  preselectedId?: string;
  onSelect?: (network?: TPrivateNetworkSubnet) => void;
  showSpinner?: boolean;
}

export const SubnetSelector = ({
  projectId,
  networkId,
  allowsEmpty,
  disabled,
  className,
  title,
  preselectedId,
  onSelect,
  showSpinner,
  region,
}: Readonly<SubnetSelectorProps>) => {
  const [subnet, setSubnet] = useState<TPrivateNetworkSubnet>(
    allowsEmpty ? ({ id: 'none' } as TPrivateNetworkSubnet) : undefined,
  );
  const { t: tAdd } = useTranslation('network-add');
  const { t: tCommon } = useTranslation('common');
  const {
    data: availableSubnets,
    isPending,
    error,
  } = useRegionSubnets(projectId, region, networkId);

  useEffect(() => {
    if (preselectedId) {
      const selected = availableSubnets?.find((net) => net.id === preselectedId);
      setSubnet(selected);
      onSelect?.(selected);
    } else if (availableSubnets?.length && !allowsEmpty) {
      setSubnet(availableSubnets[0]);
      onSelect?.(availableSubnets[0]);
    }
  }, [availableSubnets]);

  if (isPending)
    return showSpinner ? (
      <OsdsSpinner className={className} size={ODS_SPINNER_SIZE.md} inline />
    ) : (
      <OsdsSkeleton className={className} />
    );

  return (
    <>
      <OsdsFormField className={className}>
        {title && (
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
            slot="label"
          >
            {title}
          </OsdsText>
        )}
        {error && (
          <OsdsMessage
            type={ODS_MESSAGE_TYPE.error}
            color={ODS_THEME_COLOR_INTENT.error}
            className="my-6"
          >
            {tAdd('kubernetes_network_form_subnet_error_default', {
              error: error.message,
            })}
          </OsdsMessage>
        )}
        <SelectComponent
          name="subnet"
          size={ODS_SELECT_SIZE.md}
          value={subnet?.id}
          onOdsValueChange={({ detail }) => {
            const sub = availableSubnets?.find((net) => net.id === detail.value);
            setSubnet(sub || ({ id: 'none' } as TPrivateNetworkSubnet));
            onSelect?.(sub);
          }}
          disabled={disabled || undefined}
        >
          {allowsEmpty && (
            <OsdsSelectOption key="none" value="none">
              {tCommon('common_none')}
            </OsdsSelectOption>
          )}
          {availableSubnets?.map((sub) => (
            <OsdsSelectOption key={sub.id} value={sub.id}>
              {`${sub.id} - ${sub.cidr}`}
            </OsdsSelectOption>
          ))}
        </SelectComponent>
      </OsdsFormField>
    </>
  );
};
