import { LOCALES } from '@ovhcloud/ods-react';
import React from 'react';

const OdsLocaleList = () => {
  return (
    <ul>
      {LOCALES.map((locale) => (
        <li key={locale}>{locale}</li>
      ))}
    </ul>
  );
};

export {
  OdsLocaleList,
};
