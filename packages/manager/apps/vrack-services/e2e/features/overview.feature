Feature: Overview page

  Scenario Outline: User wants to update his vRack Services informations
    Given User has 19 vRack Services
    Given User has a vRack Services with a status <resourceStatus>
    When User navigates to vRack Services Overview page
    Then User sees the action buttons on the overview as <buttonState>

    Examples:
      | resourceStatus | buttonState |
      | UPDATING       | disabled    |
      | DELETING       | disabled    |
      | ERROR          | disabled    |
      | READY          | enabled     |

  Scenario Outline: User want to edit his vRack Services display name
    Given User has 19 vRack Services
    Given User has a vRack Services with a status READY
    Given The service to edit a vRack Services is <apiOk>
    When User navigates to vRack Services Overview page
    And User updates the display name of this vRack Services from the overview
    Then User sees <anyErrorMessage> error message
    And User sees <anySuccessMessage> success message

    Examples:
      | apiOk | anyErrorMessage | anySuccessMessage |
      | OK    | no              | an                |
      | KO    | an              | no                |
