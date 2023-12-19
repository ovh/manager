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
    Given User wants to create a vRack Services with name "<name>" and zone <zone>
    Given The order service for vRack Services is <orderVsOk>
    Given The order service for vRack is <orderVrackOk>
    When User fills the configuration form and click the submit button
    Then A modal appear to ask if the user wants to create a new vRack
    When User <acceptOrDenyOrCancel>
    Then User "<returnListing>" on the Listing page
    Then User sees <anyErrorMessage> error message

    Examples:
      | name | zone | orderVsOk | orderVrackOk | acceptOrDenyOrCancel | returnListing  | anyErrorMessage |
      | vs-1 | RBX  | OK        | OK           | accepts              | returns        | no              |
      | vs-2 | BHS  | KO        | OK           | accepts              | doesn't return | an              |
      | vs-3 | LIM  | OK        | KO           | accepts              | doesn't return | an              |
      |      | RBX  | KO        | KO           | accepts              | doesn't return | an              |
      |      | RBX  | OK        | KO           | denies               | returns        | no              |
      |      | RBX  | OK        | OK           | denies               | returns        | no              |
      |      | RBX  | OK        | OK           | cancel               | doesn't return | no              |
