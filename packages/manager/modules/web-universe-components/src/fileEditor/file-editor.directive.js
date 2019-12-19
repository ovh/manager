import angular from 'angular';
import $ from 'jquery';
import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';
import uniq from 'lodash/uniq';

import template from './file-editor.html';

export default /* @ngInject */ ($anchorScroll, $location) => ({
  restrict: 'A',
  template,
  scope: {
    wucFileEditorItemValidator: '=',
    wucFileEditorNewItem: '=',
    wucFileEditorExistingItems: '=',
    wucFileEditorMatchExistingItems: '=?',
    wucFileEditorErrors: '=',
    tr: '=',
    trpl: '=',
    ngModel: '=',
  },
  link: ($scope, element) => {
    const $editor = element.find('.editor');
    const $inputFile = $(element).find('input[type=file]');

    $scope.wucFileEditorMatchExistingItems = angular
      .isDefined($scope.wucFileEditorMatchExistingItems)
      ? $scope.wucFileEditorMatchExistingItems
      : false;

    $scope.fileModel = {
      value: '',
    };

    $scope.newItem = {
      value: $scope.wucFileEditorNewItem,
    };

    $scope.loader = false;

    $scope.checkAddItem = (item) => {
      if ($scope.wucFileEditorMatchExistingItems) {
        if ($scope.wucFileEditorExistingItems.indexOf(item) === -1) {
          $scope.newItem = {
            value: $scope.wucFileEditorNewItem,
          };
          return false;
        }
        return true;
      }

      if (!item || !$scope.wucFileEditorItemValidator(item)) {
        $scope.newItem = {
          value: $scope.wucFileEditorNewItem,
        };
        return false;
      }

      return $scope.wucFileEditorItemValidator(item);
    };

    $scope.addItem = (data) => {
      if (data) {
        $scope.ngModel.push(data);
        $scope.newItem = {
          value: $scope.wucFileEditorNewItem,
        };
      } else {
        $scope.newItem = {
          value: $scope.wucFileEditorNewItem,
        };
      }
    };

    $scope.goToAddItem = () => {
      $location.hash('add-new-item');
      $anchorScroll();
    };

    $scope.removeItem = (item) => {
      remove($scope.ngModel, (it) => it === item);
    };

    $scope.removeAll = () => {
      $scope.ngModel = [];
      $inputFile.val(null);
      $scope.fileModel = {
        value: '',
      };
    };

    $scope.goToNextError = () => {
      const nextError = findIndex(
        $scope.ngModel,
        (item) => !$scope.wucFileEditorItemValidator(item),
      );
      if (nextError !== -1) {
        $location.hash(`err-${nextError}`);
        $anchorScroll();
      }
    };

    $editor.scroll(() => {
      $scope.$apply(() => {
        $scope.showButtonAdd = $editor.scrollTop() > 40;
      });
    });

    $scope.$watch('fileModel.value', () => {
      $scope.loader = true;
      if ($scope.fileModel.value) {
        $scope.ngModel = uniq($scope.fileModel.value.trim().split(/\s/g));

        if (!$scope.wucFileEditorMatchExistingItems) {
          $scope.ngModel = $scope.ngModel
            .filter((item) => !!item && $scope.wucFileEditorExistingItems.indexOf(item) === -1);
        } else {
          $scope.ngModel = $scope.ngModel
            .filter((item) => $scope.wucFileEditorExistingItems.indexOf(item) !== -1);
        }
      } else {
        $scope.ngModel = [];
      }
      $scope.loader = false;
    });

    $scope.$watch(
      'ngModel',
      () => {
        if (Array.isArray($scope.ngModel)) {
          if ($scope.ngModel.length === 0) {
            $scope.removeAll();
          }

          $scope.wucFileEditorErrors = $scope.ngModel
            .filter((item) => !$scope.wucFileEditorItemValidator(item));
        }
      },
      true,
    );
  },
});
