Feature: Shell client communication

Scenario: Plugin method invokation
  Given I have one plugin registered in my shell
  And My shell and shell client are configured with a direct message bus
  When I invoke a method from my plugin
  Then The invokation should be resolved with the method result

