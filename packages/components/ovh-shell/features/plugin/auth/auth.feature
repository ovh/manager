Feature: Authentication Plugin

Scenario: Log in
  Given An authentication plugin
  When I try to log in
  Then I should go to the login page

Scenario: Log out
  Given An authentication plugin
  When I try to log out
  Then I should go to the logout page
