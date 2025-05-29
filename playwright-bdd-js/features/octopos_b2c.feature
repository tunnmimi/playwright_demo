Feature: B2C Filter order from Octopos

As a developer
  I want 

      Scenario: Verify Opollo order push to Octopos
        Given I open the admin octopos login page
         When I log in with valid credentials
         Then I should see the dashboard
         When I navigate to the B2C order
         And I find "{b2corderCode}" as the B2C order code
         #  And I clear range date
        Then I should see the order "{b2corderCode}" in the listing


