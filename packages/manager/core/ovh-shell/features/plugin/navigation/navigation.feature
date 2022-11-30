Feature: navigation Plugin

Scenario: Retrieving a URL
  Given I have a navigation plugin instanciated
  When I try to get a URL from an application
  Then I should get a builded URL
