Feature: logger Plugin

Scenario: Enable the plugin
<<<<<<< HEAD
  Given I have a logger plugin instantiated
=======
  Given I have a logger plugin instanciated
>>>>>>> 065fbd2966 (fix(generator): move ovh shell in component)
  And debug flag is activated
  When I try to log, info, warn, error, debug something
  Then I should see the result in console

Scenario: Disable the plugin
<<<<<<< HEAD
  Given I have a logger plugin instantiated
=======
  Given I have a logger plugin instanciated
>>>>>>> 065fbd2966 (fix(generator): move ovh shell in component)
  When I try to log, info, warn, error, debug something
  Then I should not see anything in the console
