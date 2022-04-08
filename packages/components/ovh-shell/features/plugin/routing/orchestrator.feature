Feature: URL synchronization orchestrator

Scenario: Navigating in iframe updates the container URL
  Given A routing configuration
  And An orchestrator
  When I navigate in the iframe
  Then The container URL should be updated

Scenario: Changing the container URL update the iframe URL
  Given A routing configuration
  And An orchestrator
  When I change the container URL
  Then The iframe URL should be updated

Scenario: Changing the container URL to a standalone application
  Given A routing configuration
  And An orchestrator
  When I change the container URL to a standalone application
  Then I should be redirected

Scenario: Changing the container URL to an unknown application
  Given A routing configuration
  And An orchestrator
  When I change the container URL to an unknown application
  Then I should be redirected to the default application
