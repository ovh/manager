import { SecretData } from '@secret-manager/types/secret.type';

import { Code } from '@ovhcloud/ods-react';

import { SECRET_RAW_VALUE_TEST_ID } from './secretValueRaw.constants';

type SecretValueRawProps = {
  data: SecretData;
};

export const SecretValueRaw = ({ data }: SecretValueRawProps) => {
  return (
    <Code className="block break-all" data-testid={SECRET_RAW_VALUE_TEST_ID}>
      {JSON.stringify(data, null, 2)}
    </Code>
  );
};
