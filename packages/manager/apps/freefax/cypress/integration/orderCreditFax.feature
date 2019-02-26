Feature: order credit fax
  I want to order some credit fax

Background:
  Given an active freefax

Scenario: order credit fax
  Given I am on my freefax dashboard
  When I order <quantity> credits
  Then I can access to the order

  Examples:
    |quantity|
    |10|
    |50|
    |100|
    |200|
    |500|
    |1000|
    |2000|
    |5000|
    |10000|
