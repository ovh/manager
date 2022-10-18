import React, { useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';

import initI18n from './i18n';
import OvhContext, { initOvhContext, OvhContextType } from './ovh-context';
import OvhContainerRoutingSync from './ovh-routing';

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
      <HashRouter>
        {context && (
          <>
            <OvhContainerRoutingSync />
            {children}
          </>
        )}
        {!context && '…'}
      </HashRouter>
    </OvhContext.Provider>
  );
}

export default OvhApplication;
