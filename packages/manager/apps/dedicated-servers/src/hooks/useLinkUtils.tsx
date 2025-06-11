import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type LinkEntry = { [key: string]: string | LinkEntry };
export type UrlLinks = { [key: string]: LinkEntry | UrlEntry | string };
export type UrlEntry = { [key: string]: string };

function useLinkUtils<T extends string | UrlEntry | UrlLinks | LinkEntry>(
  dictionaryLinks: LinkEntry,
) {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [links, setLinks] = useState({});

  useEffect(() => {
    const getSubSidiary = async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();
      const localLinks =
        dictionaryLinks[ovhSubsidiary] || dictionaryLinks.DEFAULT;
      setLinks(localLinks);
    };
    getSubSidiary();
  }, []);
  return links as T;
}

export default useLinkUtils;
