import { useEffect } from 'react';

const EloquantSurvey = () => {
  useEffect(() => {
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
        return 'french';
      });

      // You can add other conditions to manage yourself the single answer for example
      // elq.set('condition.showPopin', function(){ return "true"; });

      // Data surveys : in this example there is an Eloquant text data defined in the project, called region => Capture4
      // Do not forget to choose it during the publication's step "Parameters" => Capture1
      // If the website exposes a javascript variable which may be used to fill this data, the following line of code is not necessary.
      // Only fill the checkbox "variable javascript" and enter the name of the website variable.
      elq.set('urlparameter.region', function() {
        return 'Europe';
      });

      // Triggered Events
      elq.set('event.onTrigger', function() {
        console.log(
          'when the criteria is triggered : after 180sec on the site, the user scrolls...',
        );
      });
      elq.set('event.onInvitation', function() {
        console.log(
          'the invitation is displayed : criterias and conditions are checked',
        );
      });
      elq.set('event.onDeclineInvitation', function() {
        return console.log(
          "user does not want to answer : 'No' button or 'cross' button",
        );
      });
      elq.set('event.onDisplay', function() {
        return console.log('the survey is displayed');
      });
      elq.set('event.onCloseDisplay', function() {
        return console.log(
          "the survey is cloed : 'cross' button or 'close window' button present on the thank you page",
        );
      });
      elq.set('event.onConditionFailed', function() {
        return console.log(
          'after the trigger event, the condtions are evaluated. When the condition is not ok.',
        );
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
