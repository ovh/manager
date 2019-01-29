Feature: Freefax dashboard
  I want to open the freefax dashboard

Scenario: User sees the freefax dashboard
  Given I am logged
  And I have a freefax
  And the freefax is active
  When I go to my freefax
  Then I see my freefax dashboard
