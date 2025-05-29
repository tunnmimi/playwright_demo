Feature: B2C Return Order Processing

      Scenario: Create and verify a B2C Return Order
        Given I open the admin login page
        When I log in with valid credentials
        Then I should see the dashboard
        When I navigate to the B2C Return Orders page
        When I click on Create New B2C return order
        And I enter "LDPNES-SRM38HOTWL" in the WH Order No field and press Enter
        And I select a handle type
        And I select CS as the Paid Objec
        And I enter "automation playwright" in the remark field
        And I select Giao Hàng Nhanh as the shipping method
        And I select SKU "skuoct_tunn_100 TestSKU 100"
        And I enter "1" as the return quantity
        And I click the Submit button
        And I confirm the submission
        Then I should see the order code starting with "RT" and ending with "_dev"
        And I save the order code to "data.json"
        When I navigate to the B2C return orders page
        Then I should be able to find and click on the saved order