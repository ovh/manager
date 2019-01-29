Feature: Freefax notifications
  I want to manage my freefax notifications

Background:
  Given an active freefax
  And no notification

Scenario: User add an e-mail notification for the fax
  Given I am on my freefax dashboard
  When I fill a correct e-mail
  And I select a notification for the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User add an e-mail notification for the voicemail
  Given I am on my freefax dashboard
  When I fill a correct e-mail
  And I select a notification for the voicemail
  Then I see a confirmation
  And the notifications number is updated

Scenario: User add an e-mail notification for the voicemail and the fax
  Given I am on my freefax dashboard
  When I fill a correct e-mail
  And I select a notification for the voicemail and the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User add an e-mail notification with attachement for the fax
  Given I am on my freefax dashboard
  When I fill a correct e-mail
  And I select a notification with attachement for the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User add an e-mail notification with attachement for the voicemail
  Given I am on my freefax dashboard
  When I fill a correct e-mail
  And I select a notification with attachement for the voicemail
  Then I see a confirmation
  And the notifications number is updated

Scenario: User add an e-mail notification with attachement for the voicemail and the fax
  Given I am on my freefax dashboard
  When I fill a correct e-mail
  And I select a notification with attachement for the voicemail and the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User delete an e-mail notification for the fax
  Given I am on my freefax dashboard
  When I delete a notification for the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User delete an e-mail notification for the voicemail
  Given I am on my freefax dashboard
  When I delete a notification for the voicemail
  Then I see a confirmation
  And the notifications number is updated

Scenario: User delete an e-mail notification for the voicemail and the fax
  Given I am on my freefax dashboard
  When I delete a notification for the voicemail and the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User delete an e-mail notification with attachement for the fax
  Given I am on my freefax dashboard
  When I delete a notification with attachement for the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User delete an e-mail notification for the voicemail
  Given I am on my freefax dashboard
  When I delete a notification with attachement for the voicemail
  Then I see a confirmation
  And the notifications number is updated

Scenario: User edit an e-mail notification for the voicemail and the fax
  Given I am on my freefax dashboard
  When I edit a notification with attachement for the voicemail and the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User edit an e-mail notification for the fax
  Given I am on my freefax dashboard
  When I edit a notification for the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User edit an e-mail notification for the voicemail
  Given I am on my freefax dashboard
  When I edit a notification for the voicemail
  Then I see a confirmation
  And the notifications number is updated

Scenario: User edit an e-mail notification for the voicemail and the fax
  Given I am on my freefax dashboard
  When I edit a notification for the voicemail and the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User edit an e-mail notification with attachement for the fax
  Given I am on my freefax dashboard
  When I edit a notification with attachement for the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User delete an e-mail notification for the voicemail
  Given I am on my freefax dashboard
  When I delete a notification with attachement for the voicemail
  Then I see a confirmation
  And the notifications number is updated

Scenario: User delete an e-mail notification for the voicemail and the fax
  Given I am on my freefax dashboard
  When I delete a notification with attachement for the voicemail and the fax
  Then I see a confirmation
  And the notifications number is updated

Scenario: User fill an incorrect e-mail notification
  Given I am on my freefax dashboard
  When I fill an incorrect e-mail
  Then I can't validate the form
  And The e-mail field becomes invalid
