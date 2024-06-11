import { useEffect } from 'react';

const EloquantSurvey = () => {
  useEffect(() => {
    const doc = window.document || document;
    const script = doc.createElement('script');
    const url = /MSIE \d|Trident.*rv:/.test(navigator.userAgent)
      ? 'https://cache.eloquant.cloud/ovh/itw/webtrigger-test-ie11.js?s=LpSH433M4z'
      : 'https://cache.eloquant.cloud/ovh/itw/webtrigger-test.js?s=LpSH433M4z';

    script.setAttribute('type', 'text/javascript');
    script.src = url;
    script.defer = true;

    script.onload = function() {
      if (!window.elqwebtrigger) return;
      const elq = window.elqwebtrigger;
      elq.set('condition.language', function() {
        return 'french';
      });
    };

    doc.head.appendChild(script);
  }, []);

  return <></>;
};

export default EloquantSurvey;
