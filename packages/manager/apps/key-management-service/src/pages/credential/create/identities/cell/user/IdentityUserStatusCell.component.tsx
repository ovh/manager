import React from 'react';
import { IdentityUser } from '@/types/identity.type';
import IdentitiesStatusBadge from '../../badge/IdentitiesStatusBadge.component';

const IdentityUserStatusCell = (user: IdentityUser) => {
  return (
    <span>
      <IdentitiesStatusBadge status={user.status} inline />
    </span>
  );
};

export default IdentityUserStatusCell;
