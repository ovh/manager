Feature: vRack Services feature availability

  Scenario Outline: User gets redirected if vRack Services feature is not available
    Given Feature availability service is <apiOk>
    Given vRack Services feature is <availability>
    When User navigates to vRack Services Listing page
    Then User "<isRedirected>" redirected to HUB

    Examples:
      | apiOk | availability | isRedirected |
      | ok    | available    | is not       |
      | ko    | available    | is           |
      | ok    | unavailable  | is           |
