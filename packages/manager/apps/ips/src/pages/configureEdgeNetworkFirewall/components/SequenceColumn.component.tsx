import React from 'react';
import { OdsText, OdsSelect } from '@ovhcloud/ods-components/react';
import { IpEdgeFirewallRule } from '@/data/api';
import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

export const validSequenceNumbers = Array.from(Array(20).keys());

export const SequenceColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const { newSequence, setNewSequence, ruleSequenceList } = React.useContext(
    EdgeNetworkFirewallContext,
  );
  const nextAvailableSequence = validSequenceNumbers.find(
    (num) => !ruleSequenceList.includes(num),
  );

  return rule?.isNew ? (
    <OdsSelect
      name="sequence-select"
      value={newSequence?.toString() ?? nextAvailableSequence?.toString()}
      onOdsChange={(e) =>
        setNewSequence(parseInt(e.detail.value as string, 10))
      }
    >
      {validSequenceNumbers.map((sequence) => (
        <option
          key={sequence}
          value={sequence}
          disabled={ruleSequenceList.includes(sequence)}
        >
          {sequence}
        </option>
      ))}
    </OdsSelect>
  ) : (
    <OdsText>{rule?.sequence}</OdsText>
  );
};
