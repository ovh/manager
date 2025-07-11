import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

type CreateCredentialConfirmationDetailsTextProps = {
  label: string;
  value: string | undefined;
};

const CreateCredentialConfirmationDetailsText = ({
  label,
  value,
}: CreateCredentialConfirmationDetailsTextProps) => {
  return (
    <div className="grid grid-cols-2">
      <OdsText preset={ODS_TEXT_PRESET.span}>{`${label}:`}</OdsText>
      <OdsText preset={ODS_TEXT_PRESET.span}>{value}</OdsText>
    </div>
  );
};
export default CreateCredentialConfirmationDetailsText;
