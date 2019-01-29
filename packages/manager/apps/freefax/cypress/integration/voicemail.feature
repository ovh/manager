Feature: voicemail configuration
  I want to manage my voicemail configuration

Background:
  Given an active freefax
  And the voicemail is disabled

Scenario: activate the voicemail
  Given I am on my freefax dashboard
  When I activate my voicemail
  Then I see a confirmation
  And The voicemail configuration is updated
  And The voicemail state is updated

Scenario: alter the voicemail configuration
  Given I am on my freefax dashboard
  When I alter the voicemail configuration
  Then The voicemail configuration is updated

Scenario: disable the voicemail
  Given I am on my freefax dashboard
  When I disable my voicemail
  Then I see a confirmation
  And The voicemail configuration is updated
  And The voicemail state is updated
