Feature: Iframe message bus

    Allows the iframe to communicate with the Shell via a MessageBus.
    If there is no need for an iframe, the app could still communicate
    with the Shell through the MessageBus.

Scenario: Message bus sends a message with an iframe
  Given My message bus has an iframe
  When The message bus sends a message
  Then The message should be usable through the event Message

Scenario: Message bus sends a message without iframe
  Given My message bus has no iframe
  When The message bus sends a message
  Then The message should be usable through the event Message

Scenario: Message bus receives a message
  Given I have a message bus instance
  When My message bus receives a callback
  And A post message is called
  Then The callback should trigger with post message data
