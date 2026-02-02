import { Link } from '@ovhcloud/ods-react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useGetDomainContact } from '@/domain/hooks/data/query';
import { useGetConnectedNichandleId } from '@/common/hooks/nichandle/useGetConnectedNichandleId';

interface DatagridColumnContactProps {
  readonly contactId: string;
  readonly isOwner: boolean;
}

export default function DatagridColumnContact({
  contactId,
  isOwner = false,
}: DatagridColumnContactProps) {
  const { nichandle: connectedNichandle } = useGetConnectedNichandleId();

  const { data: userAccountUrl } = useNavigationGetUrl([
    'account',
    '/useraccount/infos',
    {},
  ]);

  const { domainContact } = useGetDomainContact(contactId, {
    enabled: isOwner,
  });

  if (isOwner) {
    return (
      <DataGridTextCell>
        {domainContact
          ? domainContact.organisationName ||
          `${domainContact.firstName} ${domainContact.lastName}`
          : contactId}
      </DataGridTextCell>
    );
  }

  return connectedNichandle === contactId ? (
    <Link href={userAccountUrl}>{contactId}</Link>
  ) : (
    <DataGridTextCell>{contactId}</DataGridTextCell>
  );
}
