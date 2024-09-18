import React from 'react';
import Users from './users.component';
import UserGroups from './userGroups.component';
import ServiceAccounts from './serviceAccounts.component';
import OVHAccounts from './ovhAccounts.component';
import { filterIdentities } from '@/utils/credential/filterIdentities';
import { useOutletCredential } from '../Credential.page';

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
    <div className="flex flex-col gap-8 min-w-9">
      <Users identities={userIdentities} />
      <UserGroups identities={groupsIdentities} />
      <ServiceAccounts identities={serviceAccountsIdentities} />
      <OVHAccounts identities={OVHAccountsIdentities} />
    </div>
  );
};

export default Identities;
