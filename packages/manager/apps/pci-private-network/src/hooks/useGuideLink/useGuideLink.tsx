import { useContext, useState, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { GUIDE_LINKS } from './useGuideLink.constant';

type GetGuideLinkProps = {
  name?: string;
  subsidiary: OvhSubsidiary;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  return Object.entries(GUIDE_LINKS).reduce(
    (result, [key, value]) => ({
      [key]: value[subsidiary] ?? value.DEFAULT,
      ...result,
    }),
    {} as { [guideName: string]: string },
  );
}

export type UseGuideLinkProps = {
  [guideName: string]: string;
};

export default function useGuideLink() {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const [links, setLinks] = useState<UseGuideLinkProps>({});

  useEffect(() => {
    const guides = getGuideListLink({
      subsidiary: ovhSubsidiary as OvhSubsidiary,
    });
    setLinks(guides);
  }, [ovhSubsidiary]);

  return links;
}
