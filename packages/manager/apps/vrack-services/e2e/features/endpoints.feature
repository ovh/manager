Feature: Endpoints page

  Scenario Outline: User wants to see the endpoints of a vRack Services
    Given User has a vRack Services that <hasSubnet> a subnet
    Given This subnet <hasEndpoint> a endpoint
    When User navigates to the vRack Services Endpoints page
    Then User sees the endpoints <page> page

    Examples:
      | hasSubnet    | hasEndpoint  | page       |
      | has          | has          | Listing    |
      | has          | doesn't have | Onboarding |
      | doesn't have | doesn't have | Onboarding |
