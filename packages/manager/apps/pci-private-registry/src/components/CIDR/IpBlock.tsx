import {
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { OsdsInput } from '@ovhcloud/ods-components/react';
import { Controller, useFormContext } from 'react-hook-form';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

const IpBlock = () => {
  const { formState, control } = useFormContext();
  const { t } = useTranslation(['ip-restrictions']);

  return (
    <>
      <Controller
        name="ipBlock"
        control={control}
        render={({ field: { onChange, value } }) => (
          <DataGridTextCell>
            <OsdsInput
              placeholder="ex: 192.168.1.1/32"
              color={ODS_TEXT_COLOR_INTENT.primary}
              type={ODS_INPUT_TYPE.text}
              value={value}
              onOdsValueChange={(e) => onChange(e.target.value)}
              className="border"
              error={Boolean(formState.errors?.ipBlock?.message)}
            />
          </DataGridTextCell>
        )}
      />
    </>
  );
};

export default IpBlock;
