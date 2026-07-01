import { Suspense, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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

  // No `navbar.backUrl` is passed: the configo's Return/Finish buttons then
  // fall back to `window.history.back()` (SPA) instead of a hard
  // `window.location.href`. Combined with this route being a child of
  // DomainDetailPage (which stays mounted), returning to the originating tab
  // is fluid — no full dashboard reload, no focus-driven remount loop.
  return (
    <div className="suspend-module">
      <Suspense fallback={<Loading />}>
        <AnycastComponent
          subsidiary={user.ovhSubsidiary}
          language={i18n.language}
          hostAppName="manager"
          zoneName={serviceName ?? ''}
          dnssecSupported={dnssecSupported}
        />
      </Suspense>
    </div>
  );
}
