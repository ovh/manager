Feature: OTB remote control actions
  I want to open the freefax dashboard

Background:
  Given an active OTB

Scenario: add a remote control with minimals parameters
  Given I am on the remote control tab
  When I add a valid IPV4
  And A valid port
  And An expiration date in the future
  Then I can see a success message
  And I can see my remote access inside the table

Scenario: add a remote control with all the parameters
  Given I am on the remote control tab
  When I add a valid IPV4
  And A valid port
  And An expiration date in the future
  And A valid SSH key
  Then I can see a success message
  And I can see my remote access inside the table

Scenario: add a remote control with an incorrect IP
  Given I am on the remote control tab
  When I add an invalid IPV4
  Then the IP field becomes invalid
  And I can't add the remote access

Scenario: add a remote control with an OTB out of reach
  Given I am on the remote control tab
  And The OTB didn't respond for more than 10 minuts
  When I add a valid IPV4
  Then A get a message telling me the OTB is out of reach

Scenario: delete a remote control
  Given I have an existing remote control access
  When I delete the access
  Then The access is removed from the table
