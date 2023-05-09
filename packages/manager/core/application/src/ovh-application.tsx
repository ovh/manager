import { useEffect, useState, Suspense } from 'react';
import { ApplicationId } from '@ovh-ux/manager-config';

import initI18n from './i18n';
import OvhContext, { initOvhContext, OvhContextType } from './ovh-context';

async function init(name: ApplicationId) {
  const context = await initOvhContext(name);
  const availableLocales = await context.shell.i18n.getAvailableLocales();
  await initI18n(
    context.environment.getUserLocale(),
    availableLocales.map(({ key }) => key),
  );
  return context;
}

export function OvhApplication({
  name,
  children,
}: {
  name: ApplicationId;
  children: JSX.Element;
}): JSX.Element {
  const [context, setContext] = useState<OvhContextType>(null);

  useEffect(() => {
    init(name).then(setContext);
  }, []);

  return (
    <OvhContext.Provider value={context}>
      {context && <Suspense fallback={null}>{children}</Suspense>}
    </OvhContext.Provider>
  );
}

export default OvhApplication;
