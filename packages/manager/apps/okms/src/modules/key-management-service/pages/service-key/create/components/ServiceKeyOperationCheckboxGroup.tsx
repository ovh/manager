import { useServiceKeyOperationsTranslations } from '@key-management-service/hooks/service-key/useServiceKeyOperationsTranslations';
import {
  OkmsServiceKeyOperationUsage,
  OkmsServiceKeyOperations,
} from '@key-management-service/types/okmsServiceKey.type';
import { OkmsServiceKeyReferenceOperations } from '@key-management-service/types/okmsServiceKeyReference.type';

import { Checkbox, CheckboxControl, CheckboxGroup, CheckboxLabel, Text } from '@ovhcloud/ods-react';

type ServiceKeyOperationCheckboxGroupProps = {
  referenceOperations: OkmsServiceKeyReferenceOperations[] | undefined;
  selectedOperations: OkmsServiceKeyOperations[];
  onCheckboxChange: (operation: OkmsServiceKeyOperations[]) => void;
  disabled: boolean;
};

export const ServiceKeyOperationCheckboxGroup = ({
  referenceOperations,
  selectedOperations,
  onCheckboxChange,
  disabled,
}: ServiceKeyOperationCheckboxGroupProps) => {
  // The reference operations objects specify operation pairs that are available for the key type
  // All pairs will be displayed as a single checkbox in the UI

  // Flatten the reference pairs into a single array of operations, then convert to usages
  const referenceOperationsFlat =
    referenceOperations?.map((operation) => operation.value).flat() || [];
  // ['encrypt', 'decrypt', 'sign', 'verify'] -> ['encrypt_decrypt', 'sign_verify']
  const referenceUsages = operationsToUsages(referenceOperationsFlat);

  // Convert the selected operations into usages
  const selectedUsages = operationsToUsages(selectedOperations);

  const { usageNamesMap, usageDescriptionsMap } = useServiceKeyOperationsTranslations();

  const handleValueChange = (value: string[]) => {
    const usages = value as OkmsServiceKeyOperationUsage[];
    // Convert the usages back into operations ['encrypt_decrypt'] -> ['encrypt', 'decrypt']
    const operations = usagesToOperations(usages);
    onCheckboxChange(operations);
  };

  return (
    <CheckboxGroup onValueChange={handleValueChange} value={selectedUsages} disabled={disabled}>
      {referenceUsages.map((usage) => {
        return (
          <Checkbox key={usage} value={usage}>
            <CheckboxControl />
            <CheckboxLabel>
              <Text className="block" preset="paragraph">
                {usageNamesMap[usage]}
              </Text>
              <Text preset="caption">{usageDescriptionsMap[usage]}</Text>
            </CheckboxLabel>
          </Checkbox>
        );
      })}
    </CheckboxGroup>
  );
};

// ['encrypt', 'decrypt', 'sign', 'verify'] -> ['encrypt_decrypt', 'sign_verify']
const operationsToUsages = (
  operations: OkmsServiceKeyOperations[],
): OkmsServiceKeyOperationUsage[] => {
  const usages: OkmsServiceKeyOperationUsage[] = [];

  if (operations.includes('encrypt') && operations.includes('decrypt')) {
    usages.push('encrypt_decrypt');
  }
  if (operations.includes('sign') && operations.includes('verify')) {
    usages.push('sign_verify');
  }
  if (operations.includes('wrapKey') && operations.includes('unwrapKey')) {
    usages.push('wrapKey_unwrapKey');
  }

  return usages;
};

// ['encrypt_decrypt', 'sign_verify'] -> ['encrypt', 'decrypt', 'sign', 'verify']
const usagesToOperations = (usages: OkmsServiceKeyOperationUsage[]): OkmsServiceKeyOperations[] => {
  return usages.flatMap((usage) => {
    if (usage === 'encrypt_decrypt') {
      return ['encrypt', 'decrypt'];
    }
    if (usage === 'sign_verify') {
      return ['sign', 'verify'];
    }
    if (usage === 'wrapKey_unwrapKey') {
      return ['wrapKey', 'unwrapKey'];
    }
    return [];
  });
};
