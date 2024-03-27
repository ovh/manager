Feature: Overview page

  Scenario Outline: User wants to update his vRack Services informations
    Given User has a vRack Services with a status <resourceStatus>
    Given User selects his vRack Services in the Listing page
    When User navigates to the vRack Services Overview page
    Then User sees the edit and associate a vRack buttons as <buttonState>

    Examples:
      | resourceStatus | buttonState |
      | UPDATING       | disabled    |
      | DELETING       | disabled    |
      | ERROR          | disabled    |
      | READY          | enabled     |
