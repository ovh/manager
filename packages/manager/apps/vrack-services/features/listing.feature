Feature: Listing page

  Scenario: User has a vRack Services order
    Given User does not have any vRack Services
    Given User has a vRack Services order
    When User navigates to vRack Services Listing page
    Then User sees an empty listing page with an information message about the order status

  Scenario: User has a vRack Services and an order
    Given User has a vRack Services ready
    Given User has a vRack Services order
    When User navigates to vRack Services Listing page
    Then User sees a data grid containing his vRack Services information
    Then User sees an information message about his vRack Services order status

  Scenario: User cannot modify a vRack Services in error
    Given User has a vRack Services in error
    When User navigates to vRack Services Listing page
    Then User sees a data grid containing his vRack Services information
    Then User sees the edit and delete buttons as disabled
