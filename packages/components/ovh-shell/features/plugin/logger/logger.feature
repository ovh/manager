Feature: logger Plugin

Scenario: Enable the plugin
<<<<<<< HEAD
<<<<<<< HEAD
  Given I have a logger plugin instantiated
=======
  Given I have a logger plugin instanciated
>>>>>>> 065fbd2966 (fix(generator): move ovh shell in component)
=======
  Given I have a logger plugin instantiated
>>>>>>> 92b89d986f (feat(generator.test): update logger feature)
  And debug flag is activated
  When I try to log, info, warn, error, debug something
  Then I should see the result in console

Scenario: Disable the plugin
<<<<<<< HEAD
<<<<<<< HEAD
  Given I have a logger plugin instantiated
=======
  Given I have a logger plugin instanciated
>>>>>>> 065fbd2966 (fix(generator): move ovh shell in component)
=======
  Given I have a logger plugin instantiated
>>>>>>> 92b89d986f (feat(generator.test): update logger feature)
  When I try to log, info, warn, error, debug something
  Then I should not see anything in the console
