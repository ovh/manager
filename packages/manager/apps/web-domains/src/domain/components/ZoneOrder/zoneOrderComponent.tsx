import { Suspense, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ZoneComponent } from './zoneOrderModule';
import Loading from '@/common/components/Loading/Loading';
import { useGetDomainResource } from '@/domain/hooks/data/query';

export default function ZoneOrderComponent() {
  const { i18n } = useTranslation();
  const { serviceName } = useParams<{ serviceName: string }>();
  const {
    environment: { user },
  } = useContext(ShellContext);
  const { domainResource, isFetchingDomainResource } = useGetDomainResource(
    serviceName ?? '',
  );

  if (isFetchingDomainResource) {
    return <Loading />;
  }

  const dnssecSupported = domainResource?.currentState?.dnssecConfiguration
    ?.dnssecSupported
    ? 'true'
    : 'false';

  // Configo "Return" (and post-submit "Finish") buttons should land on the
  // domain general information tab. The MFE navigates `window.location.href`
  // to navbar.backUrl, so derive the sibling tab URL from the current
  // `/zone/activate` location to stay agnostic to the shell URL scheme.
  // Anchored to the end of the URL (works with the hash router, where the route
  // lives in the hash) and preserves any trailing query string, so the wrong
  // occurrence can't be replaced.
  const backUrl = window.location.href.replace(
    /\/zone\/activate\/?(\?.*)?$/,
    '/information$1',
  );

  return (
    <div className="suspend-module">
      <Suspense fallback={<Loading />}>
        <ZoneComponent
          subsidiary={user.ovhSubsidiary}
          language={i18n.language}
          hostAppName="manager"
          zoneName={serviceName ?? ''}
          dnssecSupported={dnssecSupported}
          navbar={{ backUrl }}
        />
      </Suspense>
    </div>
  );
}
