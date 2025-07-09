import React from 'react';
import { OdsText, OdsInput } from '@ovhcloud/ods-components/react';
import {
  OdsInputChangeEventDetail,
  OdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import { IpGameFirewallRule } from '@/data/api';
import { PORT_MAX } from '../gamefirewall.utils';

export const PortColumn = ({
  rule,
  value,
  onChange,
}: {
  value: string;
  onChange: (e: OdsInputCustomEvent<OdsInputChangeEventDetail>) => void;
  rule: IpGameFirewallRule & { isNew?: boolean };
}) => {
  return rule?.isNew ? (
    <OdsInput
      className="w-full"
      name="port-port-input"
      value={value}
      onOdsChange={onChange}
      maxlength={PORT_MAX.toString().length}
    />
  ) : (
    <OdsText>{rule?.ports.to}</OdsText>
  );
};
