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
  const backUrl = window.location.href.replace('/zone/activate', '/information');

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
