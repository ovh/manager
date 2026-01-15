import { ReactNode } from 'react';

import { Text } from '@ovhcloud/ods-react';

type IdentitiesTileTextProps = {
  children: ReactNode;
};

const IdentitiesTileText = ({ children }: IdentitiesTileTextProps) => {
  return (
    <Text preset="paragraph" className="pl-3">
      {children}
    </Text>
  );
};

export default IdentitiesTileText;
