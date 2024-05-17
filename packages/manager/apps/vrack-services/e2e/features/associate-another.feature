Feature: Associate to another from overview page

  Scenario Outline: User click on action menu of private network
    Given User has 20 vRack Services
    Given User "<hasVrack>" a vRack Services associated to a vRack
    When User navigates to vRack Services Overview page
    Then User "<seeActionMenu>" the action menu with button dissociate
    When User click on the private network action menu button
    Then User sees button associate another

    Examples:
      | hasVrack     | seeActionMenu |
      | has          | see           |
      | doesn't have | doesn't see   |

  Scenario Outline: User associate a vRack Services to another vRack
    Given User has 20 vRack Services
    Given User "has" a vRack Services associated to a vRack
    Given The webservice to dissociate a vRack is <dissociateOkOrKo>
    Given The service to associate a vRack Services is <associateOkOrKo>
    Given The vRack task service is <taskOkOrKo>
    When User navigates to vRack Services Overview page
    Then User "see" the action menu with button dissociate
    When User click on the private network action menu button
    Then User sees button associate another
    When User click on associate another in action menu of private network
    Then A modal appears to associate the vRack Services to another vRack
    When User select the first vRack on the associate another vRack list and confirm
    Then User "<returnOverview>" on the Overview page from associate another modal
    Then User sees <anyErrorMessage> error message
    Then User sees <anySuccessMessage> success message

    Examples:
      | dissociateOkOrKo | associateOkOrKo | taskOkOrKo | returnOverview  | anyErrorMessage | anySuccessMessage |
      | ok               | OK              | ok         | returns         | no              | an                |
      | ko               | OK              | ok         | doesn't returns | an              | no                |
      | ok               | OK              | ko         | doesn't returns | an              | no                |
      | ok               | KO              | ok         | doesn't returns | an              | no                |
