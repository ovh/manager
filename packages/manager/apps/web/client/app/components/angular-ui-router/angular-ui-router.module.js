import isUndefined from 'lodash/isUndefined';
import union from 'lodash/union';
import uniq from 'lodash/uniq';

angular.module('App').config(($transitionsProvider) => {
  const getStateTranslationParts = (state) => {
    let result = state.translations || [];
    if (state.views) {
      angular.forEach(state.views, (value) => {
        if (isUndefined(value.noTranslations) && !value.noTranslations) {
          if (value.translations) {
            result = union(result, value.translations);
          }
        }
      });
    }
    return uniq(result);
  };

  $transitionsProvider.onBefore({}, (transition) => {
    transition.addResolvable({
      token: 'translations',
      deps: ['$translate', '$translatePartialLoader', '$state'],
      resolveFn: ($translate, $translatePartialLoader, $state) => {
        const state = transition.to();
        const stateParts = state.name.match(/[^.]+/g);
        const stateList = [];
        let stateName = '';
        let translations = [];
        // Find parent states
        angular.forEach(stateParts, (part) => {
          stateName = stateName ? `${stateName}.${part}` : part;
          stateList.push(stateName);
        });
        // Get all translations along the state hierarchy
        angular.forEach(stateList, (stateElt) => {
          translations = union(
            translations,
            getStateTranslationParts($state.get(stateElt)),
          );
        });
        translations = uniq(translations);
        angular.forEach(translations, (part) => {
          $translatePartialLoader.addPart(part);
        });
        return $translate.refresh();
      },
    });
  });
});
