import { Suspense, useContext } from 'react';
import { WebHostingComponent } from './webHostingOrderModule';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import Loading from '@/common/components/Loading/Loading';

export default function WebHostingOrderComponent() {
  const { i18n } = useTranslation();
  const {
    environment: { user },
  } = useContext(ShellContext);

  return (
    <div className="suspend-module">
      <Suspense fallback={<Loading />}>
        <WebHostingComponent
          subsidiary={user.ovhSubsidiary}
          language={i18n.language}
          hostAppName="manager"
        />
      </Suspense>
    </div>
  );
}
