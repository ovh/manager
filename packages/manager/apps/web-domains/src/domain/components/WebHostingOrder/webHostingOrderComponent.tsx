import { Suspense, useContext } from 'react';
import { WebHostingComponent } from './webHostingOrderModule';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getLanguageKey } from '@/domain/utils/utils';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading/Loading';

export default function WebHostingOrderComponent() {
  const { i18n } = useTranslation();
  const {
    environment: { user },
  } = useContext(ShellContext);
  const langCode = getLanguageKey(i18n.language);

  return (
    <div className="suspend-module">
      <Suspense fallback={<Loading />}>
        <WebHostingComponent
          subsidiary={user.ovhSubsidiary}
          language={langCode}
          hostAppName="manager"
        />
      </Suspense>
    </div>
  );
}
