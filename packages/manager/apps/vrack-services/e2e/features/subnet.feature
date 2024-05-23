Feature: Subnet page

  Scenario Outline: User wants to see the subnets of a vRack Services
    Given User has 20 vRack Services
    Given User has a vRack Services that "<hasSubnet>" a subnet and a status READY
    When User navigates to subnets page
    Then User sees the subnets <page> page

    Examples:
      | hasSubnet    | page       |
      | has          | Listing    |
      | doesn't have | Onboarding |

  Scenario Outline: User can create a subnet
    Given User has 20 vRack Services
    Given User has a vRack Services that "<hasSubnet>" a subnet and a status <resourceStatus>
    When User navigates to subnets page
    Then User sees the create a subnet button <buttonState>

    Examples:
      | hasSubnet    | resourceStatus | buttonState |
      | has          | UPDATING       | disabled    |
      | has          | DELETING       | disabled    |
      | has          | ERROR          | disabled    |
      | has          | READY          | disabled    |
      | doesn't have | UPDATING       | disabled    |
      | doesn't have | DELETING       | disabled    |
      | doesn't have | ERROR          | disabled    |
      | doesn't have | READY          | enabled     |

  Scenario Outline: User wants to creates a new subnet for his vRack Services
    Given User has 20 vRack Services
    Given User has a vRack Services that "doesn't have" a subnet and a status READY
    Given User wants to create a subnet with name "<name>" and CIDR "<cidr>" and service range "<serviceRange>" and vlan "<vlan>"
    Given The service to create a subnet is <apiOk>
    Given User is on subnets Creation page
    When User fills the subnet form and clicks the submit button
    Then User "<returnListing>" on the Subnet Listing page
    Then User sees <anyErrorMessage> error message

    Examples:
      | name  | cidr           | serviceRange | vlan | apiOk | returnListing  | anyErrorMessage |
      |       |                |              |      | OK    | returns        | no              |
      | sub-1 |                |              |      | OK    | returns        | no              |
      |       | 192.168.0.0/24 |              |      | OK    | returns        | no              |
      |       |                | 10.0.0.0/24  |      | OK    | returns        | no              |
      |       |                |              | 2    | OK    | returns        | no              |
      | sub-2 | 10.0.0.0/24    | 10.0.0.0/27  | 40   | OK    | returns        | no              |
      |       |                |              |      | KO    | doesn't return | an              |

  Scenario Outline: User wants to edit an existing subnet
    Given User has 20 vRack Services
    Given User has a vRack Services that "has" a subnet and a status READY
    Given The service to edit a subnet is <apiOk>
    When User navigates to subnets page
    And User updates the display name of a subnet
    Then User sees <anyErrorMessage> error message

    Examples:
      | apiOk | anyErrorMessage |
      | OK    | no              |
      | KO    | an              |

  Scenario Outline: User wants to delete an existing subnet
    Given User has 20 vRack Services
    Given User has a vRack Services that "has" a subnet and a status READY
    Given The service to delete a subnet is <apiOk>
    When User navigates to subnets page
    And User opens subnets delete modal
    When User fills the subnets delete form
    Then User sees <anyErrorMessage> error message

    Examples:
      | apiOk | anyErrorMessage |
      | OK    | no              |
      | KO    | an              |
