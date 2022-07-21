import React, { useEffect, useState } from 'react';
import initI18n from './i18n';
import OvhContext, { initOvhContext } from './ovh-context';

async function init(name) {
  const context = await initOvhContext(name);
  await initI18n(context.environment.userLocale);
  return context;
}

export function OvhApplication({ name, children }): JSX.Element {
  const [context, setContext] = useState();

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
