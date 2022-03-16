Feature: Application navigation

Scenario: Navigating to an another app
  Given I am in the hub app
  And My app is configured with hub and dedicated apps
  When I navigate to dedicated app
  Then My URl should have updated with dedicated path config

Scenario: Navigating to an inexistant app
  Given I am in the hub app
  And My app is configured with hub and dedicated apps
  When I navigate to app web
  Then I should have an error thrown

Scenario: Navigating to another app from constructed URL
  Given I am in the hub app
  And My app is configured with hub and dedicated apps
  And My URL has a lot of parameters
  When I navigate to app dedicated
  Then My URL should be clean and updated with dedicated path config

Scenario: Navigating to an app in another container
  Given I am in the hub app
  And My app is configured with hub and a foo application in another container
  When I navigate to the foo application
  Then I should be redirected to foo application publicURL

