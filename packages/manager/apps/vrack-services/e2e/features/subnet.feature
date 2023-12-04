Feature: Subnet page

  Scenario Outline: User wants to see the subnets of a vRack Services
    Given User has a vRack Services that <haveSubnet> a subnet
    When User navigates to the vRack Services Subnet page
    Then User sees the subnet <page> page

    Examples:
      | haveSubnet   | page       |
      | has          | Listing    |
      | doesn't have | Onboarding |
