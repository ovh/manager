Feature: Configuration page

  Scenario Outline: User can create a vRack Services
    Given User has <nbVrack> vRack Services
    When User navigates to vRack Services Listing page
    Then User sees the create a vRack Services button <buttonState>

    Examples:
      | nbVrack | buttonState |
      | 0       | enabled     |
      | 1       | enabled     |
      | 5       | enabled     |
      | 20      | disabled    |

  Scenario Outline: User wants to create a new vRack Services
    Given User wants to create a vRack Services with name "<name>" and region <region>
    When User fills the configuration form and clicks the submit button
    Then A modal appear to ask if the user wants to create a new vRack
    When User <acceptOrDenyOrCancel>
    Then User "<returnListing>" on the Listing page

    Examples:
      | name | region | acceptOrDenyOrCancel | returnListing  |
      | vs-1 | RBX    | accepts              | returns        |
      | vs-2 | BHS    | denies               | returns        |
      |      | LIM    | cancel               | doesn't return |
