Feature: Listing page

  Scenario: User is redirected to an empty listing after creating his first vRack Services
    Given User does not have any vRack Services
    When User creates a vRack Services
    Then User gets redirected to Listing page
    Then User sees an information message about the order status of his vrack Services
    Then User sees an empty listing page

  Scenario: User gets a vRack Services order
    Given User has a vRack Services
    When User creates a vRack Services
    Then User gets redirected to Listing page
    Then User sees an information message about the order status

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
