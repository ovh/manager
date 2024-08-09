Feature: Error

  Scenario Outline: Display an error if request fails
    Given The service to fetch the data is <apiOk>
    When User navigates to Home page
    Then User "<sees>" the list of data
    Then User sees <anyError> error

    Examples:
      | apiOk | sees        | anyError |
      | OK    | sees        | no       |
      | KO    | doesn't see | an       |
