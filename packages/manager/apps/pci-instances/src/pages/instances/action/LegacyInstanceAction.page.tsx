import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUrlSearchParams } from '@/hooks/url/useUrlSearchParams';
import { usePathMatch } from '@/hooks/url/usePathMatch';

type TSectionType = 'delete' | 'start' | 'stop' | 'shelve' | 'unshelve';
const actionSectionRegex = /(?:rescue\/(start|end)|(?<!rescue\/)(start|stop|shelve|unshelve|delete))$/;

/**
 * React component to handle leagcy non-regionalized routes for instance actions.
 * E.g. /instances/delete?instanceId="1234" should redirect to /instances/region/null/instance/1234/delete
 * If section or instanceId are not valid, we force Parent Element to not render <Outlet /> thanks to state property.
 * TODO: To be removed once legacy routes will not be used anymore
 */
const LegacyInstanceAction: FC = () => {
  const location = useLocation();
  const section = usePathMatch<TSectionType>(actionSectionRegex);
  const { instanceId, region } = useUrlSearchParams('instanceId', 'region');
  const canRedirect = !!section && !!instanceId;
  const redirectHref = `../region/${region ||
    null}/instance/${instanceId}/${section}`;
  const currentHref = `${location.pathname}${location.search}`;

  return (
    <Navigate
      to={canRedirect ? redirectHref : currentHref}
      replace
      {...(!canRedirect && { state: { notFoundAction: true } })}
    />
  );
};

export default LegacyInstanceAction;
