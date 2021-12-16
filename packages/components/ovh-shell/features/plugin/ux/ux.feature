Feature: ux Plugin

Scenario: Toggle the visibility of a ux component
  Given I have a ux plugin instanciated with a registered sidebar
  When I toggle the visibility of the sidebar
  Then I should see the sidebar

Scenario: Toggle the visibility of sidebar when toggle is disabled
  Given I have a sidebar visible
  And My sidebar is not allowed to be toggled
  When I try to change the visibility
  Then My sidebar should still be visible

Scenario: Trigger custom action when visibility of sidebar changes
  Given I have a sidebar visible
  And A custom action
  When I change sidebar visibility
  Then My custom action should trigger

