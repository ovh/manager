import { useEffect, useState, Suspense } from 'react';
import { ApplicationId } from '@ovh-ux/manager-config';
import initI18n from './i18n';
import OvhContext, { initOvhContext, OvhContextType } from './ovh-context';
import { useLogger } from './hooks';

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
  const logger = useLogger();

  useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 61b6ea55a2 (fix: sonar bugs and code smells)
    initOvhContext(name)
      .then(async (ovhContext) => {
        const contextWithI18n = await setLocale(ovhContext);
        setContext(contextWithI18n);
        contextWithI18n.shell.i18n.onLocaleChange(() =>
          setLocale(contextWithI18n).then(setContext),
        );
      })
<<<<<<< HEAD
      .catch((err) => console.error(err));
=======
    initOvhContext(name).then(async (ovhContext) => {
      const contextWithI18n = await setLocale(ovhContext);
      setContext(contextWithI18n);
      contextWithI18n.shell.i18n.onLocaleChange(() =>
        setLocale(contextWithI18n).then(setContext),
      );
    });
>>>>>>> 934f9fb911 (fix(generator): rename useShellClient into initShellClient to avoid hook)
=======
      .catch((err) => logger.error(err));
>>>>>>> 61b6ea55a2 (fix: sonar bugs and code smells)
  }, []);

  return (
    <OvhContext.Provider value={context}>
      {context && <Suspense fallback={null}>{children}</Suspense>}
    </OvhContext.Provider>
  );
}

export default OvhApplication;
