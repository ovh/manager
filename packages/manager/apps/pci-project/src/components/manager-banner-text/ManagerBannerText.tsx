import React, { useContext } from 'react';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

// LangId type definition
type LangId = 'nl' | 'fr' | 'en' | 'de' | 'es' | 'it' | 'pl' | 'pt';

const ManagerBannerText: React.FC = () => {
  const shell = useContext(ShellContext);

  const message = shell.environment.getMessage();

  if (!message || !message.en) {
    return null;
  }

  const userLanguage = shell.environment.getUserLanguage() as LangId;
  const localizedMessage = message[userLanguage] || message.en;

  return <OdsMessage color={ODS_MESSAGE_COLOR.warning}>{localizedMessage.description}</OdsMessage>;
};

export default ManagerBannerText;
