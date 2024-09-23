import { Description } from '@ovh-ux/manager-react-components';
import React from 'react';

type CreateCredentialConfirmationDetailsTextProps = {
  label: string;
  value: string;
};

const CreateCredentialConfirmationDetailsText = ({
  label,
  value,
}: CreateCredentialConfirmationDetailsTextProps) => {
  return (
    <div className="grid grid-cols-2">
      <Description>{`${label}:`}</Description>
      <Description>{value}</Description>
    </div>
  );
};
export default CreateCredentialConfirmationDetailsText;
