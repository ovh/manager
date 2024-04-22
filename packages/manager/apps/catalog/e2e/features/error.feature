Feature: Error

  Scenario Outline: Display an error if request fails
    Given The service to fetch the catalog is <apiOk>
    When User navigates to catalog
    Then User "<sees>" the list of products
    Then User sees <anyError> error

    Examples:
      | apiOk | sees        | anyError |
      | OK    | sees        | no       |
      | KO    | doesn't see | an       |
