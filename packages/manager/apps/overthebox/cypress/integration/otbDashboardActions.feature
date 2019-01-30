Feature: OTB dashboard actions
  I want to manage my OTB

Background:
  Given an active OTB

Scenario: launch of an application update
  Given I am on my OTB dashboard
  When I launch an applications update
  Then I see a success message

Scenario: launch of an update system
  Given I am on my OTB dashboard
  When I launch a system update
  Then I see a success message

Scenario: OTB reboot
  Given I am on my OTB dashboard
  When I reboot my OTB
  Then I see a success message

Scenario: OTB resiliation
  Given I am on my OTB dashboard
  And The current date isn't between the 31 and the 4 of the next month
  When I delete my OTB
  Then I see a success message
  And I see a pending message

Scenario: OTB resiliation cancel
  Given I have a pending resiliation
  When I cancel my resiliation
  Then I see a success message
  And I don't see a pending message

Scenario: device connected modification
  Given I have a device available
  When I alter my device ID with a correct value
  Then I see a success message

Scenario: device connected modification with an incorrect id
  Given I am on my OTB dashboard
  When I alter my device ID with an incorrect value
  Then I can't validate the new ID
  And The ID field becomes red
  And I can cancel my modification

Scenario: otb stats
  Given I am on my OTB dashboard
  Then I can see download stats
  And I can see my upload stats
