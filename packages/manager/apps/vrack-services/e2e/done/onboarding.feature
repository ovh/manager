Feature: Onboarding page

  Scenario: User wants to find informations related to vRack Services
    Given User does not have any vRack Services
    When User navigates to vRack Services Listing page
    Then User gets redirected to Onboarding page
    Then User sees 2 guides on vRack Services

  Scenario: Users wants to create his first vRack Services
    Given User is on the Onboarding page
    When User clicks on the vRack Services configuration button
    Then User navigates to Configuration page

  Scenario: Users gets redirected to the Listing page if a vRack Services is ordered
    Given User is on the Onboarding page
    Given User does not have any vRack Services
    When User orders a vRack Services
    Then User navigates to Listing page
