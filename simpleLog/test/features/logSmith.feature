# features/logSmith.feature

Feature: SimpleLogLogger Feature
  Scenario: SimpleLogConstruction
    Given A User create a new instance of a SimpleLog logger with "<optionsKey>"
    Then All Static fields should have the values as provided by "<optionsKey>" and the Date Format should be "<dateFormat>"

    Examples:
        | optionsKey                     | dateFormat |
        | logAllNoFileWrite              | yyyy-MM-dd |
        | logDebugNoFileWrite            | yyyy-MM-dd |
        | logInfoNoFileWrite             | yyyy-MM-dd |
        | logWarnNoFileWrite             | yyyy-MM-dd |
        | logErrorNoFileWrite            | yyyy-MM-dd |
        | logAllWithFileWrite            | yyyy-MM-dd |
        | logAllWithFileWriteAndFlushSize| yyyy-MM-dd |

  Scenario: SimpleLogConstruction and Logging to file
    Given A User create a new instance of a SimpleLog logger with "<optionsKey>"
    Then All Static fields should have the values as provided by "<optionsKey>" and the Date Format should be "<dateFormat>"
    And we log messages <times> times
    And the log queue should be clear after we waited <waitTime> seconds

    Examples:
        | optionsKey                     | dateFormat | times | waitTime |
        | logAllWithFileWrite            | yyyy-MM-dd | 1     | 3000 |
        | logAllWithFileWriteAndFlushSize| yyyy-MM-dd | 6     | 3000 |

  Scenario: SimpleLogConstruction and Logging to file
    Given A User create a new instance of a SimpleLog logger with "<optionsKey>"
    Then All Static fields should have the values as provided by "<optionsKey>" and the Date Format should be "<dateFormat>"
    And we log messages <times> times
    And the log queue should be clear after we waited <waitTime> seconds
    Then we log messages 4 times and have cleared the interval
    And the log queue should be clear after we waited 3000 seconds
 

    Examples:
        | optionsKey                          | dateFormat | times | waitTime |
        | logAllWithFileWriteAndFlushInterval | yyyy-MM-dd | 100     | 8000 |