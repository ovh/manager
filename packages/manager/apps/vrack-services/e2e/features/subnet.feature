Feature: Subnet page

  Scenario Outline: User wants to see the subnets of a vRack Services
    Given User has a vRack Services that "<hasSubnet>" a subnet
    When User navigates to the vRack Services Subnet page
    Then User sees the subnet <page> page

    Examples:
      | hasSubnet    | page       |
      | has          | Listing    |
      | doesn't have | Onboarding |

# Scenario Outline: User can create a subnet
#   Given User has a vRack Services that "<hasSubnet>" a subnet
#   Given User has a vRack Services that is <resourceStatus>
#   Given User selects his vRack Services in the Listing page
#   When User navigates to the vRack Services Subnet page
#   Then User sees the create a subnet button <buttonState>

#   Examples:
#     | hasSubnet    | resourceStatus | buttonState |
#     | has          | UPDATING       | disabled    |
#     | has          | DELETING       | disabled    |
#     | has          | ERROR          | disabled    |
#     | has          | READY          | disabled    |
#     | doesn't have | UPDATING       | disabled    |
#     | doesn't have | DELETING       | disabled    |
#     | doesn't have | ERROR          | disabled    |
#     | doesn't have | READY          | enabled     |

# Scenario Outline: User wants to creates a new subnet for his vRack Services
#   Given User wants to create a subnet with name <name> and CIDR <cidr> and service range <serviceRange> and vlan <vlan>
#   Given The API endpoint to update vRack Services is <apiOk>
#   When User navigate to subnet creation page, fills the form and clicks the submit button
#   Then User "<returnListing>" on the Subnet Listing page
#   Then User sees <anyErrorMessage> error message

#   Examples:
#     | name  | cidr           | serviceRange | vlan | apiOk | returnListing  | anyErrorMessage |
#     |       |                |              |      | OK    | returns        | no              |
#     | sub-1 |                |              |      | OK    | returns        | no              |
#     |       | 192.168.0.0/24 |              |      | OK    | returns        | no              |
#     |       |                | 10.0.0.0/24  |      | OK    | returns        | no              |
#     |       |                |              | 2    | OK    | returns        | no              |
#     | sub-2 | 10.0.0.0/24    | 10.0.0.0/27  | 40   | OK    | returns        | no              |
#     |       |                |              |      | KO    | doesn't return | an              |

# Scenario Outline: User wants to edit an existing subnet
#   Given User wants to edit an existing subnet
#   Given The API endpoint to update vRack Services is <apiOk>
#   When User navigate to subnet Listing page and updates the display name of a subnet
#   Then User sees <anyErrorMessage> error message

#   Examples:
#     | apiOk | anyErrorMessage |
#     | OK    | no              |
#     | KO    | an              |

# Scenario Outline: User wants to delete an existing subnet
#   Given User wants to delete a subnet
#   Given The API endpoint to update vRack Services is <apiOk>
#   When User navigate to subnet Listing page and delete a subnet
#   Then User sees a modal to confirm deletion
#   When User fills the delete form
#   Then User sees <anyErrorMessage> error message

#   Examples:
#     | apiOk | anyErrorMessage |
#     | OK    | no              |
#     | KO    | an              |
