Feature: ux Plugin

Scenario: Toggle the visibility of a ux component
  Given I have a ux plugin instanciated with a registered sidebar
  When I toggle the visibility of the sidebar
  Then I should see the sidebar
