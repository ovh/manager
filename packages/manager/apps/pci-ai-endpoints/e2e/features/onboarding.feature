Feature: Onboarding page

  Scenario: User wants to find informations related to pci-ai-endpoints
    Given User has 0 elements in the Listing page
    When User navigates to Listing page
    Then User gets redirected to Onboarding page
    Then User sees 3 guides
