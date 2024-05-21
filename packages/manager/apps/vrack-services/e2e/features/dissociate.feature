Feature: Dissociate from overview page

  Scenario Outline: User click on action menu of private network
    Given User has 20 vRack Services
    Given User "<hasVrack>" a vRack Services associated to a vRack
    When User navigates to vRack Services Overview page
    Then User "<seeActionMenu>" the action menu with button dissociate
    When User click on the private network action menu button
    Then User sees button dissociate

    Examples:
      | hasVrack     | seeActionMenu |
      | has          | see           |
      | doesn't have | doesn't see   |

  Scenario Outline: User dissociate a vRack Services from a vRack
    Given User has 20 vRack Services
    Given User "has" a vRack Services associated to a vRack
    Given The webservice to dissociate a vRack is <okOrKo>
    When User navigates to vRack Services Overview page
    Then User "see" the action menu with button dissociate
    When User click on the private network action menu button
    Then User sees button dissociate
    When User click on dissociate in action menu of private network
    Then A modal appears to ask if the user wants to dissociate the vRack
    When User <acceptOrCancel> modal
    Then User "<returnOverview>" on the Overview page from dissociation modal
    Then User sees <anyErrorMessage> error message

    Examples:
      | okOrKo | acceptOrCancel | returnOverview  | anyErrorMessage |
      | ok     | accept         | returns         | no              |
      | ko     | accept         | doesn't returns | an              |
      | ok     | cancel         | returns         | no              |
      | ko     | cancel         | returns         | no              |
