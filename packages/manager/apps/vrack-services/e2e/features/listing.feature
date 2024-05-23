Feature: Listing page

  Scenario: User sees an empty vRack Services listing
    Given User has 0 vRack Services
    Given User has a vRack Services order delivering
    When User navigates to vRack Services Listing page
    Then User sees an information message about the order status of his vRack Services
    Then User sees an empty listing page

  Scenario: User has a vRack Services and an order
    Given User has 19 vRack Services
    Given User has a vRack Services in DRAFT state
    Given User has a vRack Services order delivering
    When User navigates to vRack Services Listing page
    Then User sees an information message about the order status of his vRack Services
    Then User sees a data grid containing his vRack Services information

  Scenario Outline: User wants to edit a vRack Services display name
    Given User has 19 vRack Services
    Given User has a vRack Services in DRAFT state
    Given The service to edit a vRack Services is <apiOk>
    When User navigates to vRack Services Listing page
    And User updates the display name of a vrack-services
    Then User sees <anyErrorMessage> error message
    And User sees <anySuccessMessage> success message

    Examples:
      | apiOk | anyErrorMessage | anySuccessMessage |
      | OK    | no              | an                |
      | KO    | an              | no                |

  Scenario: User cannot modify a vRack Services in ERROR
    Given User has 19 vRack Services
    Given User has a vRack Services with a status ERROR
    When User navigates to vRack Services Listing page
    Then User sees a data grid containing his vRack Services information
    Then User sees the edit and associate a vRack buttons as disabled

  Scenario Outline: User wants to delete a vRack Services
    Given User has 8 vRack Services
    Given User has a vRack Services with a status READY
    Given The service to delete a vRack Services is <apiOk>
    When User navigates to vRack Services Listing page
    And User opens vrack-services delete modal
    When User fills the vrack-services delete form
    Then User sees <anyErrorMessage> error message

    Examples:
      | apiOk | anyErrorMessage |
      | OK    | no              |
      | KO    | an              |
