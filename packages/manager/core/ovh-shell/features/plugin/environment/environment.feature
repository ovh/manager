Feature: environment Plugin

Scenario: Changing the selected universe
  Given I have an environment instanciated
  And A custom action is setted on universe change
  When I change the selected universe
  Then I should have the universe updated
  And The custom action should be triggered
