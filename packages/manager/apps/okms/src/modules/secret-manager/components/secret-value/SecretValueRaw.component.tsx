import { SecretData } from '@secret-manager/types/secret.type';

import { OdsCode } from '@ovhcloud/ods-components/react';

import { SECRET_RAW_VALUE_TEST_ID } from './secretValueRaw.constants';

type SecretValueRawProps = {
  data: SecretData;
};

export const SecretValueRaw = ({ data }: SecretValueRawProps) => {
  return (
    <OdsCode className="block break-all" data-testid={SECRET_RAW_VALUE_TEST_ID}>
      {JSON.stringify(data, null, 2)}
    </OdsCode>
  );
};
