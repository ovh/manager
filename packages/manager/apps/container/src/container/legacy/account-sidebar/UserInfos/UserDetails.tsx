import { User } from '@ovh-ux/manager-config/types';
import React from 'react';

type Props = {
  cssBaseClassName?: string;
  user?: User;
};

const UserDetails = ({
  cssBaseClassName = '',
  user = {} as User,
}: Props): JSX.Element => {
  const { organisation, email, nichandle, auth } = user;

  return (
    <p>
      {
      auth.method === 'provider' ?
        <span className={`d-block ${cssBaseClassName}_text-small text-break`}>
          {auth.user}
        </span> :
        <>
          {organisation && (
            <span className={`d-block ${cssBaseClassName}_text-small`}>
              {organisation}
            </span>
          )}
          <span className={`d-block ${cssBaseClassName}_text-small text-break`}>
            {email}
          </span>
        </> 
      }

      {email !== nichandle && (
        <span className={`d-block ${cssBaseClassName}_text-small`}>
          {nichandle}
        </span>
      )}
    </p>
  );
};

export default UserDetails;
