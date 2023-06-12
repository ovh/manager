Feature: logger Plugin

Scenario: Enable the plugin
  Given I have a logger plugin instantiated
  And debug flag is activated
  When I try to log, info, warn, error, debug something
  Then I should see the result in console

Scenario: Disable the plugin
  Given I have a logger plugin instantiated
  When I try to log, info, warn, error, debug something
  Then I should not see anything in the console
