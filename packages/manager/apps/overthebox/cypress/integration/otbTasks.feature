Feature: OTB tasks tab
  I want to consult the tasks tab

Scenario: User sees the empty tasks table
  Given I have an active OTB
  When I go to the tasks tab
  Then I see an empty table

Scenario: User sees the tasks table with entry
  Given I have an active OTB
  And A remote access was created
  When I go to the tasks tab
  Then I see the remote access creation task in the table
