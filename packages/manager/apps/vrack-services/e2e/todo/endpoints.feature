Feature: Service Endpoints page

  Scenario Outline: User wants to see the service endpoints of a vRack Services
    Given User has a vRack Services that <hasSubnet> a subnet
    Given This subnet <hasServiceEndpoint> a service endpoint
    When User navigates to the vRack Services Service Endpoints page
    Then User sees the service endpoints <page> page

    Examples:
      | hasSubnet    | hasServiceEndpoint | page       |
      | has          | has                | Listing    |
      | has          | doesn't have       | Onboarding |
      | doesn't have | doesn't have       | Onboarding |

  Scenario Outline: User can create a service endpoint
    Given User has a vRack Services that <hasSubnet> a subnet
    Given User has a vRack Services that <hasEndpoint> a service endpoint
    Given User has a vRack Services that is <resourceStatus>
    Given User selects his vRack Services in the Listing page
    When User navigates to the vRack Services Service Endpoint page
    Then User sees the create a service endpoint button <buttonState>

    Examples:
      | hasSubnet    | hasEndpoint  | resourceStatus | buttonState |
      | has          | has          | UPDATING       | disabled    |
      | has          | has          | DELETING       | disabled    |
      | has          | has          | ERROR          | disabled    |
      | doesn't have | doesn't have | READY          | disabled    |
      | has          | has          | READY          | enabled     |
      | has          | doesn't have | READY          | enabled     |

  Scenario Outline: User wants to creates a new service endpoint for his vRack Services
    Given User has a subnet
    Given The API endpoint to update vRack Services is <apiOk>
    Given User wants to create a service endpoint
    When User navigate to Service Endpoint Creation page, fills the form and clicks the submit button
    Then User "<returnListing>" on the Service Endpoint Listing page
    Then User sees <anyErrorMessage> error message

    Examples:
      | apiOk | returnListing  | anyErrorMessage |
      | OK    | returns        | no              |
      | KO    | doesn't return | an              |
