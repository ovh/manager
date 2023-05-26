import { useEffect, useState, Suspense } from 'react';
import { ApplicationId } from '@ovh-ux/manager-config';
import initI18n from './i18n';
import OvhContext, { initOvhContext, OvhContextType } from './ovh-context';

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 61b6ea55a2 (fix: sonar bugs and code smells)
=======
>>>>>>> 77aed3aa7d (feat(generator.tracking): add ovh tracking in ods components)
    initOvhContext(name)
      .then(async (ovhContext) => {
        const contextWithI18n = await setLocale(ovhContext);
        setContext(contextWithI18n);
        contextWithI18n.shell.i18n.onLocaleChange(() =>
          setLocale(contextWithI18n).then(setContext),
        );
      })
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
      .catch((err) => console.error(err));
>>>>>>> 14b4c3089c (feat(generator.test): delete use logger in ovh application)
=======
    console.info('******************%*%*%*%**%*%*%*%*%*%*%*%*');
    console.info('entre dans le ovh application useEffect init !');
    console.info('name : ', name);
>>>>>>> 9d2cca2251 (feat(tracking): add tracking ovh)
=======
      .catch((err) => console.error(err));
>>>>>>> 77aed3aa7d (feat(generator.tracking): add ovh tracking in ods components)
  }, []);

  return (
    <OvhContext.Provider value={context}>
      {context && <Suspense fallback={null}>{children}</Suspense>}
    </OvhContext.Provider>
  );
}

export default OvhApplication;
