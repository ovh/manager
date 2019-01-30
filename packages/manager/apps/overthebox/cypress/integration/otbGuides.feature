Feature: OTB guides tab
  I want to consult the guides tab

Scenario: User sees the guides tab
  Given I have an OTB
  When I go to the guides tab
  Then I see the guides link
  And The guides names matchs thier target
