import React, { useEffect, useState } from 'react';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';
import initI18n from './i18n';
import OvhContext, { initOvhContext, OvhContextType } from './ovh-context';

async function init(name: ApplicationId) {
  const context = await initOvhContext(name);
  await initI18n(context.environment.userLocale);
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
      {context && children}
      {!context && '…'}
    </OvhContext.Provider>
  );
}

export default OvhApplication;
