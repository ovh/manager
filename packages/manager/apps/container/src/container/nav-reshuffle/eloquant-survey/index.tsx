import { useEffect } from 'react';
import { useShell } from '@/context';

const EloquantSurvey = () => {
  const shell = useShell();
  const environment = shell.getPlugin('environment').getEnvironment();
  const user = environment.getUser();
  const region = environment.getRegion();
  const languages = [
    {
      code: 'fr_FR',
      short: 'fr',
      long: 'french',
    },
    {
      code: 'en_GB',
      short: 'en',
      long: 'english',
    },
    {
      code: 'fr_CA',
      short: 'fr',
      long: 'french',
    },
    {
      code: 'pl_PL',
      short: 'pl',
      long: 'polsky',
    },
    {
      code: 'de_DE',
      short: 'de',
      long: 'DE',
    },
    {
      code: 'es_ES',
      short: 'es',
      long: 'spanish',
    },
    {
      code: 'it_IT',
      short: 'it',
      long: 'italian',
    },
    {
      code: 'pt_PT',
      short: 'pt',
      long: 'portugues',
    },
  ];

  const regions = {
    EU: 'Europe',
    CA: 'Asie',
    US: 'USA'
  };
  const regionTerm = regions[region as 'EU'|'CA'|'US'];

  useEffect(() => {
    const { short, long } = languages.filter(
      (lang) => lang.code === user.language,
    )[0];

    window.surveyLanguage = short;

    const doc = window.document || document;
    const script = doc.createElement('script');
    const url = /MSIE \d|Trident.*rv:/.test(navigator.userAgent)
      ? 'https://cache.eloquant.cloud/ovh/itw/webtrigger-test-ie11.js?s=LpSH433M4z'
      : 'https://cache.eloquant.cloud/ovh/itw/webtrigger-test.js?s=LpSH433M4z';

    script.setAttribute('type', 'text/javascript');
    script.defer = true;
    script.src = url;

    script.onload = function() {
      const elq = window.elqwebtrigger;
      // This condition is used to choose the correct publication according the language, and especially to display the popin's title in the correct language
      // The condition is defined in the first publication's step => Capture3
      elq.set('condition.language', function() {
        return long;
      });

      // Data surveys : in this example there is an Eloquant text data defined in the project, called region => Capture4
      // Do not forget to choose it during the publication's step "Parameters" => Capture1
      // If the website exposes a javascript variable which may be used to fill this data, the following line of code is not necessary.
      // Only fill the checkbox "variable javascript" and enter the name of the website variable.
      elq.set('urlparameter.region', function() {
        return regionTerm;
      });
    };
    doc.body.appendChild(script);

    return () => {
      doc.body.removeChild(script);
    };
  }, []);

  return <></>;
};

export default EloquantSurvey;
