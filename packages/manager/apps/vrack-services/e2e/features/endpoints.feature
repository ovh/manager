Feature: Service Endpoints page

  Scenario Outline: User wants to see the service endpoints of a vRack Services
    Given User has 21 vRack Services
    Given User has a vRack Services that "<hasSubnet>" a subnet and "<hasEndpoint>" an endpoint and a status READY
    When User navigates to endpoints page
    Then User sees the endpoints <page> page

    Examples:
      | hasSubnet    | hasEndpoint  | page       |
      | has          | has          | Listing    |
      | has          | doesn't have | Onboarding |
      | doesn't have | doesn't have | Onboarding |

  Scenario Outline: User can create a service endpoint
    Given User has 21 vRack Services
    Given User has a vRack Services that "<hasSubnet>" a subnet and "<hasEndpoint>" an endpoint and a status <resourceStatus>
    When User navigates to endpoints page
    Then User sees the create a endpoint button <buttonState>

    Examples:
      | hasSubnet    | hasEndpoint  | resourceStatus | buttonState |
      | has          | has          | UPDATING       | disabled    |
      | has          | has          | DELETING       | disabled    |
      | has          | has          | ERROR          | disabled    |
      | doesn't have | doesn't have | READY          | disabled    |
      | has          | has          | READY          | enabled     |
      | has          | doesn't have | READY          | enabled     |

  Scenario Outline: User wants to creates a new service endpoint for his vRack Services
    Given User has 21 vRack Services
    Given User has a vRack Services that "has" a subnet and a status READY
    Given The service to create a endpoint is <apiOk>
    Given User is on endpoints Creation page
    When User fills the endpoints form and clicks the submit button
    Then User "<returnListing>" on the Endpoints Listing page
    Then User sees <anyErrorMessage> error message

    Examples:
      | apiOk | returnListing  | anyErrorMessage |
      | OK    | returns        | no              |
      | KO    | doesn't return | an              |

  Scenario Outline: User wants to delete an existing service endpoint
    Given User has 21 vRack Services
    Given User has a vRack Services that "has" a subnet and "has" an endpoint and a status READY
    Given The service to delete a endpoint is <apiOk>
    When User navigates to endpoints page
    And User opens endpoints delete modal
    When User fills the endpoints delete form
    Then User sees <anyErrorMessage> error message
    Then User sees <anySuccessMessage> success message

    Examples:
      | apiOk | anyErrorMessage | anySuccessMessage |
      | OK    | no              | an                |
      | KO    | an              | no                |
