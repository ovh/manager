import React, { useEffect } from 'react';
import { useShell } from '@/context';
import { languages, regions } from './eloquant.constants';

const EloquantSurvey = () => {
  const shell = useShell();
  const environment = shell.getPlugin('environment').getEnvironment();
  const locale = environment.getUserLocale();
  const region = environment.getRegion();
  const user = environment.getUser();

  const regionTerm = regions[region as keyof typeof regions];

  useEffect(() => {
    const { short, long } =
      languages.find((lang) => lang.code === locale) || {};

    window.surveyLanguage = short;

    const doc = window.document || document;
    const script = doc.createElement('script');
    const url = /MSIE \d|Trident.*rv:/.test(navigator.userAgent)
      ? 'https://cache.eloquant.cloud/ovh/itw/webtrigger-test-ie11.js?s=LpSH433M4z'
      : 'https://cache.eloquant.cloud/ovh/itw/webtrigger-test.js?s=LpSH433M4z';

    script.setAttribute('type', 'text/javascript');
    script.defer = true;
    script.src = url;

    script.onload = () => {
      const elq = window.elqwebtrigger;
      // This condition is used to choose the correct publication according the language, and especially to display the popin's title in the correct language
      // The condition is defined in the first publication's step => Capture3
      elq.set('condition.language', () => {
        return long;
      });

      // Data surveys : in this example there is an Eloquant text data defined in the project, called region => Capture4
      // Do not forget to choose it during the publication's step "Parameters" => Capture1
      // If the website exposes a javascript variable which may be used to fill this data, the following line of code is not necessary.
      // Only fill the checkbox "variable javascript" and enter the name of the website variable.
      elq.set('urlparameter.region', () => {
        return regionTerm;
      });

      elq.set('urlparameter.nic_handle', () => {
        return user.nichandle;
      });
    };
    doc.body.appendChild(script);

    return () => {
      doc.body.removeChild(script);
    };
  }, [locale]);

  return <></>;
};

export default EloquantSurvey;
