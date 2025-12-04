import { useContext } from 'react';

import { Text } from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export default function McaPage() {
  //@todo: just for to have a page should develop in PRDCOL-293
  const context = useContext(ShellContext);
  const { country, email, firstname, language, name, organisation, phone } =
    context.environment.getUser();

  return (
    <div>
      <Text>{country}</Text>
      <Text>{organisation}</Text>
      <Text>{language}</Text>
      <Text>{firstname}</Text>
      <Text>{name}</Text>
      <Text>{email}</Text>
      <Text>{phone}</Text>
    </div>
  );
}
