import { Spinner, SPINNER_SIZE } from '@ovhcloud/ods-react';
import { useGetDomainContact } from '@/domain/hooks/data/query';
import { LegalFormEnum } from '@/common/enum/common.enum';

interface HolderInformationProps {
  readonly contactID: string;
}

export default function HolderInformation({
  contactID,
}: HolderInformationProps) {
  const { domainContact } = useGetDomainContact(contactID, {
    enabled: true,
  });

  if (!domainContact) {
    return <Spinner size={SPINNER_SIZE.xs} />;
  }

  return (
    <ul className="list-none p-0 m-0 font-bold">
      {domainContact && [
        domainContact.legalForm !== LegalFormEnum.Individual && (
          <li key={'organisation'}>{domainContact.organisationName}</li>
        ),
        <li key={'name'}>
          {domainContact.firstName} {domainContact.lastName}
        </li>,
        <li key={'address'}>
          {domainContact.address.line1} {domainContact.address.line2}{' '}
          {domainContact.address.zip} {domainContact.address.city}
        </li>,
        <li key={'email'}>{domainContact.email}</li>,
        <li key={'phone'}>{domainContact.phone}</li>,
      ]}
    </ul>
  );
}
