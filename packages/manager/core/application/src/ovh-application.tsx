import { useEffect, useState, Suspense } from 'react';
import { ApplicationId } from '@ovh-ux/manager-config';
import OvhContext, { initOvhContext, OvhContextType } from './ovh-context';

export function OvhApplication({
  name,
  children,
  context,
}: {
  name: ApplicationId;
  children: JSX.Element;
  context: OvhContextType;
}): JSX.Element {
  useEffect(() => {
<<<<<<< HEAD
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
  }, []);

  return (
    <OvhContext.Provider value={context}>
      {context && <Suspense fallback={null}>{children}</Suspense>}
    </OvhContext.Provider>
  );
}

export default OvhApplication;
