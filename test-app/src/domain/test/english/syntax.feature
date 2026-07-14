Feature: Syntax

  Scenario: Plural
    Given I count 2 times
    Then I count 2 times

  Scenario: Singular
    Given I count 1 time
    Then I count 1 time
