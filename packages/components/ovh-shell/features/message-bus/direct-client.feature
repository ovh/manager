Feature: Direct client message bus

    Allows the application to communicate directly with the Shell in
    the case of standalone shell usage.

Scenario: Application sends a message to the shell
  Given A direct message bus configured between the application and the shell
  When The application's message bus sends a message
  Then The message should be received by the shell

Scenario: Shell sends a message to the application
  Given A direct message bus configured between the application and the shell
  When The shell's message bus sends a message
  Then The message should be received by the application

Scenario: A direct message bus should only communicate with it's registered peers
  Given Multiple direct message bus
  When One message is sent from a message bus
  Then Only the message bus registered peers should receive the message
