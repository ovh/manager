import React from 'react';

import {
  FormField,
  Select,
  SelectContent,
  SelectControl,
  Text,
} from '@ovhcloud/ods-react';

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
    <FormField className="w-full">
      <Select
        name="sequence-select"
        value={[newSequence?.toString() ?? nextAvailableSequence?.toString()]}
        onValueChange={(e) => setNewSequence(parseInt(e.value?.[0], 10))}
        items={validSequenceNumbers.map((sequence) => ({
          label: sequence.toString(),
          value: sequence.toString(),
          disabled: ruleSequenceList.includes(sequence),
        }))}
      >
        <SelectContent />
        <SelectControl />
      </Select>
    </FormField>
  ) : (
    <Text>{rule?.sequence}</Text>
  );
};
