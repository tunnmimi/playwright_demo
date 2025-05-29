Feature: Order process on Nestle Vietnam site

  Scenario: User completes the order process on Nestle Vietnam site
    Given I navigate to the Nestle Vietnam product page
    When I add products to the cart and fill in the order details
    And I select the shipping method and payment method
    Then I should be able to successfully place the order
