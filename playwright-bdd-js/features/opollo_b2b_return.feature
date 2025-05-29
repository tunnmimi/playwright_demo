Feature: B2B Return Orders Management
 As a developer
  I want 

      Scenario: Create a new B2B Return Order
        Given I open the admin login page
         When I log in with valid credentials
         Then I should see the dashboard
         When I navigate to the B2B Return Orders page
         And I click the "Create" button
         And I enter "TTN-240158_dev" as the B2B order code
         And I select "Comming expired Date" as the return reason
         And I enter "create B2B order by playwright" in the Note field
         And I check the confirmation checkbox
         And I enter "1" in the quantity field
         And I upload the required document
         And I submit the order
         And I confirm the submission
       Then I should see the newly created order in the list

  # Scenario: Verify the newly created order
    # Given I open the admin login page
    # When I log in with valid credentials
    # Then I should see the dashboard
    # When I navigate back to the B2B Return Orders page
    # Then I should be able to find and click on the newly created order


# Scenario: Admin logs in and navigates to B2B Return Orders
    # Given I open the admin login page
    # When I log in with valid credentials
    # Then I should see the dashboard
    # When I navigate to the B2B Return Orders page
