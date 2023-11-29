Feature: Listing page

  Scenario: User sees an empty vRack Services listing
    Given User does not have any vRack Services
    Given User has a vRack Services order delivering
    When User navigates to vRack Services Listing page
    Then User sees an information message about the order status of his vRack Services
    Then User sees an empty listing page

  Scenario: User has a vRack Services and an order
    Given User has a vRack Services in DRAFT state
    Given User has a vRack Services order delivering
    When User navigates to vRack Services Listing page
    Then User sees an information message about the order status of his vRack Services
    Then User sees a data grid containing his vRack Services information

  Scenario: User has an error when editing a vRack Services
    Given User has a vRack Services in DRAFT state
    Given The service to edit a vRack Services is KO
    When User edits the vRack Services name
    Then User sees an error message

  Scenario: User associate a vRack Services with eligible vRacks
    Given User has a vRack Services in DRAFT state
    When User click on the link to associate a vRack
    Then User sees a modal to select an eligible vRack

  Scenario: User has an error when associating a vRack Services
    Given User has a vRack Services in DRAFT state
    Given The service to associate a vRack Services is KO
    When User click on the link to associate a vRack
    Then User sees a modal to select an eligible vRack
    When User selects a vRack in the association list and submits the form
    Then User sees an error message

  Scenario Outline: User associate a vRack Services with no eligible vRack
    Given User has a vRack Services in DRAFT state
    Given User has no eligible vRack for this vRack Services
    Given User has a vRack order <orderStatus>
    When User click on the link to associate a vRack
    Then User sees a modal to create a new vRack
    Then User sees <anyInformationMessage> information message about the order status of his vRack
    Then The button to create a vRack is <buttonState>

    Examples:
      | orderStatus | anyInformationMessage | buttonState |
      | delivering  | an                    | disabled    |
      | delivered   | no                    | enabled     |


  Scenario: User cannot modify a vRack Services in ERROR state
    Given User has a vRack Services in ERROR state
    When User navigates to vRack Services Listing page
    Then User sees a data grid containing his vRack Services information
    Then User sees the edit and associate a vRack buttons as disabled
