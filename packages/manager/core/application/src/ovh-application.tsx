import { Suspense, useEffect, useState } from 'react';

import { ApplicationId } from '@ovh-ux/manager-config';

import initI18n from './i18n';
import OvhContext, { OvhContextType, initOvhContext } from './ovh-context';

async function setLocale(context: OvhContextType) {
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
    initOvhContext(name)
      .then(async (ovhContext) => {
        const contextWithI18n = await setLocale(ovhContext);
        setContext(contextWithI18n);
        contextWithI18n.shell.i18n.onLocaleChange(() =>
          setLocale(contextWithI18n).then(setContext),
        );
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <OvhContext.Provider value={context}>
      {context && <Suspense fallback={null}>{children}</Suspense>}
    </OvhContext.Provider>
  );
}

export default OvhApplication;
