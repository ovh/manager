import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import checkPermsUtils from './check-perms-utils';
import { IamContext, AuthorizedContext } from './IamContext';

type IamWrapperProps = {
  children: ReactNode;
  urn: string;
  action: string;
};

const IamWrapper = ({ children, urn, action }: IamWrapperProps) => {
  const iam = useContext(IamContext);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsAuthorized(checkPermsUtils({ iamAuthorizations: iam, urn, action }));
  }, [urn, action]);
  return (
    <AuthorizedContext.Provider value={isAuthorized}>
      {isAuthorized ? (
        children
      ) : (
        <OsdsTooltip>
          {children}
          <OsdsTooltipContent slot="tooltip-content">
            Authorization required
          </OsdsTooltipContent>
        </OsdsTooltip>
      )}
    </AuthorizedContext.Provider>
  );
};

export default IamWrapper;
