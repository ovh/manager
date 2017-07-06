import bowser from 'bowser'
import browsers from './supported_browsers.json'

describe('ovh-angular-browser-alert', () => {

  let $compile, $scope

  beforeEach(angular.mock.module('ovhBrowserAlert'));

  beforeEach(angular.mock.inject((_$rootScope_, _$compile_) => {
    $scope = _$rootScope_.$new()
    $compile = _$compile_
  }))

  function compileDirective (template) {
    let element = $compile(template)($scope)
    $scope.$digest()
    return element
  }

  describe('Initialization', () => {

    it('should show nothing in a recent supported browser', () => {

      spyOn(bowser,'check').and.callFake((arg) => arg === browsers.deprecated)

      let element = compileDirective('<ovh-browser-alert></ovh-browser-alert>')
      expect(element.html()).not.toContain('oui-message_warning')
      expect(element.html()).not.toContain('oui-oui-message_error')
    })


    it('should warn user for a deprecated browser', () => {

      spyOn(bowser,'check').and.callFake((arg) => arg === browsers.unsupported)

      let element = compileDirective('<ovh-browser-alert></ovh-browser-alert>')
      expect(element.html()).toContain('oui-message_warning')
      expect(element.html()).not.toContain('oui-oui-message_error')
    })


    it('should warn user for an unsupported browser', angular.mock.inject(() => {

      spyOn(bowser,'check').and.returnValue(false)

      let element = compileDirective('<ovh-browser-alert></ovh-browser-alert>')
      expect(element.html()).not.toContain('oui-oui-message_warning')
      expect(element.html()).toContain('oui-message_error')
    }))
  })
})