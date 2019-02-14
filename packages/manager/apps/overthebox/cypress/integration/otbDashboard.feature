Feature: OTB dashboard
  I want to open the OTB dashboard

Scenario: User sees the OTB dashboard
  Given I am logged
  And I have a OTB
  And the OTB is active
  When I go to my OTB
  Then I see my OTB dashboard

Scenario: rename the service with a correct value
  Given I am on my OTB dashboard
  When I fill the description with "testingForever"
  Then I see the new description as "testingForever"

Scenario: rename the service with an empty name
  Given I am on my OTB dashboard
  When I fill the description with an empty value
  Then i see the new description as "Mon OverTheBox"
