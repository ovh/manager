import { LegalFormEnum } from '@/common/enum/common.enum';
import { useGetConnectedNichandleId } from '@/common/hooks/nichandle/useGetConnectedNichandleId';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';
import { Spinner, SPINNER_SIZE } from '@ovhcloud/ods-react';

interface NichandleInformationProps {
  readonly nichandle: string;
}

export default function NichandleInformation({
  nichandle,
}: NichandleInformationProps) {
  const { nichandleInformation } = useNichandleInformation();
  const { nichandle: connectedNichandle } = useGetConnectedNichandleId();

  if (!nichandleInformation) {
    return <Spinner size={SPINNER_SIZE.xs} />;
  }

  return (
    <ul className="list-none p-0 m-0 font-bold">
      {nichandle === connectedNichandle && [
        nichandleInformation.legalform !== LegalFormEnum.Individual && (
          <li key={'organisation'}>
            {nichandleInformation.organisation}{' '}
            {nichandleInformation.corporationType}
          </li>
        ),
        <li key={'name'}>
          {nichandleInformation.firstname} {nichandleInformation.name}
        </li>,
        <li key={'address'}>
          {nichandleInformation.address}{' '}
          {nichandleInformation.complementaryAddress} {nichandleInformation.zip}{' '}
          {nichandleInformation.city} {nichandleInformation.country}
        </li>,
        <li key={'email'}>{nichandleInformation.email}</li>,
        <li key={'phone'}>{nichandleInformation.phone}</li>,
        nichandleInformation.legalform !== LegalFormEnum.Individual && [
          <li key={'nat'}>
            {nichandleInformation.nationalIdentificationNumber}
          </li>,
          <li key={'cnat'}>
            {nichandleInformation.companyNationalIdentificationNumber}
          </li>,
          <li key={'vat'}>{nichandleInformation.vat}</li>,
        ],
      ]}
    </ul>
  );
}
