Feature: Shell initialization

Scenario: Open app without container when standalone
  Given I have a standalone application
  And Container is enabled
  When I detect the parameter standalone in the URL
  Then I do not redirect and returns current url without change

Scenario: Open app in container when not standalone
  Given I have an app
  And Container is enabled
  When I do not see the parameter standone in the url
  Then I redirect to public URL
