Feature: Async builder

  Scenario: The runner awaits the builder before running the steps
    Given a calculator loaded from "basic"
    Then the result is 7
