Feature: fax configuration
  I want to manage my fax configuration

Background:
  Given an active freefax

Scenario: complete a fax configuration
  Given I am on my freefax dashboard
  And I know the current quality setted
  And I know The current number of tries setted
  When I edit my fax configuration
  And I fill a sender with a correct value
  And I fill the mail expeditor with a correct value
  And I select a new quality setting
  And I select a new number of tries
  And I fill the fax header with a correct value
  And I submit my modifications
  Then I can see the modifications

Scenario: configure a new password
  Given I am on my freefax dashboard
  When I edit my fax configuration
  And I generate a new password
  And I display the new password
  Then I can hide the new password
  And I can cancel the edition
