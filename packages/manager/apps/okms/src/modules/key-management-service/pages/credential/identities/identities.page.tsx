import { filterIdentities } from '@key-management-service/utils/credential/filterIdentities';

import { useOutletCredential } from '../Credential.page';
import OVHAccounts from './ovhAccounts.component';
import ServiceAccounts from './serviceAccounts.component';
import UserGroups from './userGroups.component';
import Users from './users.component';

const Identities = () => {
  const {
    credential: { identityURNs },
  } = useOutletCredential();

  const userIdentities = filterIdentities({
    identities: identityURNs,
    type: 'user',
  });

  const groupsIdentities = filterIdentities({
    identities: identityURNs,
    type: 'group',
  });

  const serviceAccountsIdentities = filterIdentities({
    identities: identityURNs,
    type: 'credential',
  });

  const OVHAccountsIdentities = filterIdentities({
    identities: identityURNs,
    type: 'account',
  });

  return (
    <div className="flex min-w-9 flex-col gap-4">
      <Users identities={userIdentities} />
      <UserGroups identities={groupsIdentities} />
      <ServiceAccounts identities={serviceAccountsIdentities} />
      <OVHAccounts identities={OVHAccountsIdentities} />
    </div>
  );
};

export default Identities;
