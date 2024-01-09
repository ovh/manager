Feature: Overview page

  Scenario Outline: User wants to update his vRack Services informations
    Given User has a vRack Services that is <resourceStatus>
    Given User selects his vRack Services in the Listing page
    When User navigates to the vRack Services Overview page
    Then User sees the edit button to change diplay name as <editDisplayNameState>
    Then User sees the associate a vRack button as <associateVrackState>

    Examples:
      | resourceStatus | editDisplayNameState | associateVrackState |
      | UPDATING       | disabled             | disabled            |
      | DELETING       | disabled             | disabled            |
      | ERROR          | disabled             | disabled            |
      | READY          | enabled              | enabled             |
