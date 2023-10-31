Feature: Configuration page

  Scenario Outline: User wants to create a new vRack Services
    Given User wants to create a vRack Services with name "<name>" and zone <zone>
    Given The order service for vRack Services is <orderVsOk>
    Given The order service for vRack is <orderVrackOk>
    When User fill the form and click the submit button
    Then A modal appear to ask if the user wants to create a new vRack
    When User <acceptOrDeny>
    Then User "<returnListing>" on the Listing page
    Then User sees "<successOrErrorVs>" message for vRack Services
    Then User sees "<successOrErrorVrack>" message for vRack
    Then User sees <newLine> new line in the list of vRack Services

    Examples:
      | name | zone | orderVsOk | orderVrackOk | acceptOrDeny | returnListing  | successOrErrorVs | successOrErrorVrack | newLine |
      | vs-1 | RBX  | OK        | OK           | accepts      | returns        | a success        | a success           | a       |
      | vs-2 | BHS  | KO        | OK           | accepts      | doesn't return | an error         | no                  | no      |
      | vs-3 | LIM  | OK        | KO           | accepts      | returns        | a success        | an error            | a       |
      |      | RBX  | KO        | KO           | accepts      | doesn't return | an error         | an error            | no      |
      |      | RBX  | OK        | KO           | denies       | returns        | a success        | no                  | a       |
      |      | RBX  | OK        | OK           | denies       | returns        | a success        | no                  | a       |
