import angular from 'angular';

export default /* @ngInject */ (
  $scope,
  $rootScope,
  $timeout,
  WucCronValidator,
) => {
  // Hack for trads
  $scope.tr = $rootScope.tr;
  $scope.trpl = $rootScope.trpl;

  $scope.cron = $scope.crontabObject.getCronValue();
  $scope.mode = $scope.crontabObject.getCronMode();

  $scope.switchToSimpleMode = () => {
    const isSuccessful = WucCronValidator.switchToSimpleMode(
      $scope.cron,
      $scope.mode,
    );
    $scope.isTooComplicatedForSimpleMode = !isSuccessful;
  };

  $scope.switchToExpertMode = () => {
    WucCronValidator.switchToExpertMode($scope.cron, $scope.mode);
  };

  $scope.cronSimpleValueIsValid = (field) =>
    WucCronValidator.cronSimpleValueIsValid(field, $scope.cron, $scope.mode);

  $scope.cronExpertValueIsValid = (field) =>
    WucCronValidator.cronExpertValueIsValid(field, $scope.cron);

  function getCaretPosition(elem) {
    if (!elem) {
      return null;
    }

    let caretPos = 0;
    let sel;

    if (document.selection) {
      elem.focus();
      sel = document.selection.createRange();
      sel.moveStart('character', -elem.value.length);
      caretPos = sel.text.length;
    } else if (elem.selectionStart || elem.selectionStart === '0') {
      caretPos = elem.selectionStart;
    }

    return caretPos;
  }

  function setCaretPosition(elem, caretPos) {
    if (!elem) {
      return;
    }

    if (elem.createTextRange) {
      const range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', caretPos);
      range.moveStart('character', caretPos);
      range.select();
    } else if (elem.setSelectionRange) {
      elem.focus();
      elem.setSelectionRange(caretPos, caretPos);
    } else {
      elem.focus();
    }
  }

  // Each time user change value in expert mode, it calculates the best view
  function checkIfExpertInlineView(field) {
    let expertInlineView = true;
    let caretPos;

    angular.forEach($scope.cron.expert, (val) => {
      if (val && val.length > 7) {
        expertInlineView = false;
      }
    });
    $scope.expertInlineView = expertInlineView;

    if (
      angular.element(`#currentAction .cron_${field}:visible`) &&
      angular.element(`#currentAction .cron_${field}:visible`).length
    ) {
      caretPos = getCaretPosition(
        angular.element(`#currentAction .cron_${field}:visible`)[0],
      );
      $timeout(() => {
        setCaretPosition(
          angular.element(`#currentAction .cron_${field}:visible`)[0],
          caretPos,
        );
      }, 42);
    }
  }
  $scope.$watch('cron.expert.h', () => {
    checkIfExpertInlineView('h');
  });
  $scope.$watch('cron.expert.dom', () => {
    checkIfExpertInlineView('dom');
  });
  $scope.$watch('cron.expert.mon', () => {
    checkIfExpertInlineView('mon');
  });
  $scope.$watch('cron.expert.dow', () => {
    checkIfExpertInlineView('dow');
  });
};
