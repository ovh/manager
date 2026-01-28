import { Text } from '@ovhcloud/ods-react';

type CreateCredentialConfirmationDetailsTextProps = {
  label: string;
  value: string | undefined;
};

export const CreateCredentialConfirmationDetailsText = ({
  label,
  value,
}: CreateCredentialConfirmationDetailsTextProps) => {
  return (
    <div className="grid grid-cols-2">
      <Text preset="span">{`${label}:`}</Text>
      <Text preset="span">{value}</Text>
    </div>
  );
};
