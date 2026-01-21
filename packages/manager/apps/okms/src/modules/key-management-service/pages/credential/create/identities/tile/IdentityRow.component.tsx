import { Text } from '@ovhcloud/ods-react';

type IdentityRowProps = {
  label: string;
  value: string;
};

export const IdentityRow = ({ label, value }: IdentityRowProps) => {
  return (
    <div className="flex gap-1">
      <Text preset="small" className="whitespace-nowrap text-gray-500">
        {label}:
      </Text>
      <Text preset="small">{value}</Text>
    </div>
  );
};
