import { Suspense, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  AnycastSubscribeComponent,
  AnycastUpgradeComponent,
} from './anycastOrderModule';
import Loading from '@/common/components/Loading/Loading';
import {
  useGetDomainResource,
  useGetDomainZone,
} from '@/domain/hooks/data/query';

export default function AnycastOrderComponent() {
  const { i18n } = useTranslation();
  const { serviceName } = useParams<{ serviceName: string }>();
  const location = useLocation();
  const {
    environment: { user },
  } = useContext(ShellContext);
  const { domainResource, isFetchingDomainResource } = useGetDomainResource(
    serviceName ?? '',
  );
  const { domainZone, isFetchingDomainZone } = useGetDomainZone(
    serviceName ?? '',
    true,
  );

  if (isFetchingDomainResource || isFetchingDomainZone) {
    return <Loading />;
  }

  // No DNS zone yet → subscribe funnel (activate a zone + Anycast).
  // Existing zone → upgrade funnel (add Anycast to it).
  const AnycastComponent = domainZone
    ? AnycastUpgradeComponent
    : AnycastSubscribeComponent;

  const dnssecSupported = domainResource?.currentState?.dnssecConfiguration
    ?.dnssecSupported
    ? 'true'
    : 'false';

  // Back behaviour of the configo's Return/Finish buttons:
  // - In-app navigation (launched from a tab) → no `navbar.backUrl`, so the
  //   configo falls back to `window.history.back()` (SPA). Combined with this
  //   route being a child of DomainDetailPage (which stays mounted), the
  //   return is fluid — no full dashboard reload, no focus-driven remount loop.
  // - Direct entry (email link, bookmark, refresh) → there is no in-app
  //   history to go back to, so `history.back()` would go nowhere / out of the
  //   app. `location.key === 'default'` marks that case; we then pass an
  //   explicit backUrl to the DNS servers tab so the buttons always land
  //   somewhere sensible.
  const isDirectEntry = location.key === 'default';
  const navbar = isDirectEntry
    ? { backUrl: window.location.href.replace('/anycast/order', '/dns') }
    : undefined;

  return (
    <div className="suspend-module">
      <Suspense fallback={<Loading />}>
        <AnycastComponent
          subsidiary={user.ovhSubsidiary}
          language={i18n.language}
          hostAppName="manager"
          zoneName={serviceName ?? ''}
          dnssecSupported={dnssecSupported}
          navbar={navbar}
        />
      </Suspense>
    </div>
  );
}
