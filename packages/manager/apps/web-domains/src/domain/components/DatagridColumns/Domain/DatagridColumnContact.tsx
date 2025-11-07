import { Link } from '@ovhcloud/ods-react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useGetDomainContact } from '@/domain/hooks/data/query';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';

interface DatagridColumnContactProps {
  readonly contactId: string;
  readonly isOwner: boolean;
}

export default function DatagridColumnContact({
  contactId,
  isOwner = false,
}: DatagridColumnContactProps) {
  const { nichandleInformation } = useNichandleInformation();
  const { data: userAccountUrl } = useNavigationGetUrl([
    'account',
    '/useraccount/infos',
    {},
  ]);

  const { domainContact } = useGetDomainContact(contactId, {
    enabled: isOwner,
  });

  if (isOwner) {
    if (domainContact) {
      const details =
        domainContact.organisationName ||
        `${domainContact.firstName} ${domainContact.lastName}`;
      return <DataGridTextCell>{details}</DataGridTextCell>;
    }
    return <DataGridTextCell>{contactId}</DataGridTextCell>;
  }

  if (nichandleInformation?.nichandle === contactId) {
    const details =
      nichandleInformation.organisation ||
      `${nichandleInformation.name} ${nichandleInformation.firstname}`;
    return <Link href={userAccountUrl}>{details}</Link>;
  }

  return <DataGridTextCell>{contactId}</DataGridTextCell>;
}
