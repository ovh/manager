import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { OsdsInput } from '@ovhcloud/ods-components/react';
import { Controller, useFormContext } from 'react-hook-form';

const Description = () => {
  const { control } = useFormContext();
  return (
    <Controller
      name="description"
      control={control}
      render={({ field: { onChange, value } }) => (
        <OsdsInput
          data-testid="input-description"
          value={value}
          color={ODS_TEXT_COLOR_INTENT.primary}
          onOdsValueChange={(e) => onChange(e.detail.value)}
          type={ODS_INPUT_TYPE.text}
          placeholder="ex: VPN, CI/CD"
          className="border"
        />
      )}
    />
  );
};

export default Description;
