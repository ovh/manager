import { Suspense, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { FreeHostingComponent } from './freeHostingOrderModule';
import Loading from '@/common/components/Loading/Loading';

export default function FreeHostingOrderComponent() {
  const { i18n } = useTranslation();
  const { serviceName } = useParams<{ serviceName: string }>();
  const location = useLocation();
  const {
    environment: { user },
  } = useContext(ShellContext);

  // Back behaviour of the configo's Return/Finish buttons:
  // - In-app navigation (launched from the general information tab) → no
  //   `navbar.backUrl`, so the configo falls back to `window.history.back()`
  //   (SPA). Combined with this route being a child of DomainDetailPage (which
  //   stays mounted), the return is fluid — no full dashboard reload.
  // - Direct entry (email link, bookmark, refresh) → there is no in-app history
  //   to go back to; `location.key === 'default'` marks that case, so we pass an
  //   explicit backUrl to the general information tab.
  const isDirectEntry = location.key === 'default';
  const navbar = isDirectEntry
    ? {
      backUrl: window.location.href.replace(
        '/free-hosting/order',
        '/information',
      ),
    }
    : undefined;

  return (
    <div className="suspend-module">
      <Suspense fallback={<Loading />}>
        <FreeHostingComponent
          subsidiary={user.ovhSubsidiary}
          language={i18n.language}
          hostAppName="manager"
          serviceName={serviceName ?? ''}
          navbar={navbar}
        />
      </Suspense>
    </div>
  );
}
