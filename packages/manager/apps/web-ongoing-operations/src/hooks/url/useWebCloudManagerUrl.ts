import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useState } from 'react';
import { ParentEnum } from '@/enum/parent.enum';

export const UseWebCloudManagerUrl = (
  parent: ParentEnum.DOMAIN | ParentEnum.ZONE,
  subPath: string,
) => {
  const nav = useContext(ShellContext).shell.navigation;
  const [url, setUrl] = useState('');

  let value: string = subPath;
  if (parent === ParentEnum.DOMAIN) {
    value = `${subPath}/information`;
  }

  useEffect(() => {
    nav.getURL('web', `#/${parent}/${value}`, {}).then((data) => {
      setUrl(data as string);
    });
  }, [parent, subPath]);
  return url;
};
