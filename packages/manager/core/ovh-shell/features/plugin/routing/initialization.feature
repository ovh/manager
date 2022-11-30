Feature: Routing initialization

Scenario: Initialization of routing plugin in production
  Given A production environment
  And A default application with container disabled
  When The routing plugin is initialized
  Then I should be redirected to the default application's publicURL

Scenario: Initialization of routing plugin in development
  Given A development environment
  And A default application with container disabled
  When The routing plugin is initialized
  Then I should not be redirected
