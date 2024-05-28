Feature: Associate a vRack to a vRack Services

  Scenario Outline: Filter results based on Universe
    Given User wants to filter products by universes "<universes>"
    When User selects the universes in the filters
    And User apply the search
    Then User sees <nbProducts> products corresponding to the universe

    Examples:
      | universes                 | nbProducts |
      | Bare Metal Cloud          | 5          |
      | Bare Metal Cloud,Web PaaS | 0          |

  Scenario: Clears all filters
    Given User filtered the products with an universe
    When User clicks on the Clear All button
    Then User sees all the products of the catalog

  Scenario: Clear filter when chip is removed
    Given User filtered the products with an universe
    When User click on the remove button of a filter
    Then The corresponding chip is removed
    Then User sees all the products of the catalog
