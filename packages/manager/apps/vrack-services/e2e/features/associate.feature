Feature: Associate a vRack to a vRack Services

  Scenario: User associate a vRack Services with eligible vRacks
    Given User has 19 vRack Services
    Given User has a vRack Services in DRAFT state
    When User clicks on the link to associate a vRack
    Then User sees a modal to select an eligible vRack

  Scenario: User has an error when associating a vRack Services
    Given User has 5 vRack Services
    Given User has an eligible vRacks to be associated to his vRack Services
    Given The service to associate a vRack Services is KO
    When User clicks on the link to associate a vRack
    Then User sees a modal to select an eligible vRack
    When User selects a vRack in the association list and submits the form
    Then User sees an error message

  Scenario Outline: User associate a vRack Services with no eligible vRack
    Given User has 19 vRack Services
    Given User has a vRack Services in DRAFT state
    Given User has no eligible vRacks to be associated to his vRack Services
    Given User has a vRack order <orderStatus>
    When User clicks on the link to associate a vRack
    Then User sees a modal to create a new vRack
    Then User sees <anyInformationMessage> information message about the order status of his vRack
    Then The button to create a vRack is <buttonState>

    Examples:
      | orderStatus | anyInformationMessage | buttonState |
      | delivering  | an                    | disabled    |
      | delivered   | no                    | enabled     |
