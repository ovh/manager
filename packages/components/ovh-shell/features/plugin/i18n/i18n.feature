Feature: i18n Plugin

Scenario: Retrieving locale when nothing has changed
  Given I have a i18n plugin instanciated
  When I try to get the locale
  Then I should get the default locale

Scenario: Setting the locale
  Given I have a i18n plugin instanciated
  When I try to change the locale
  Then I should retrieve the setted locale

Scenario: Getting the list of available locales
  Given I have a i18n plugin instanciated
  When I try to get the list of available locales
  Then I should retrieve at least one available locale
