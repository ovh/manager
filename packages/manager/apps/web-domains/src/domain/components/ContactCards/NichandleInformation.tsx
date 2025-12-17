import { User } from '@ovh-ux/manager-config/dist/types/environment/user';
import { LegalFormEnum } from '@/common/enum/common.enum';

interface NichandleInformationProps {
  readonly nichandle: string;
  readonly nichandleInformation: User;
}

export default function NichandleInformation({
  nichandle,
  nichandleInformation,
}: NichandleInformationProps) {
  return (
    <ul className="list-none p-0 m-0 font-bold">
      {nichandle === nichandleInformation.nichandle && [
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
