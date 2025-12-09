import { IdentityUser } from '@key-management-service/types/identity.type';

import IdentitiesStatusBadge from '../../badge/IdentitiesStatusBadge.component';

const IdentityUserStatusCell = (user: IdentityUser) => {
  return (
    <span>
      <IdentitiesStatusBadge status={user.status} />
    </span>
  );
};

export default IdentityUserStatusCell;
