Feature: Admin Login

  Scenario: Successful login to admin panel
    Given I open the admin login page
    When I log in with valid credentials
    Then I should see the dashboard

#   Scenario: Login with invalid password
#     Given I open the admin login page
#     When I log in with username "admin@example.com" and password "wrongpassword"
#     Then I should see an error message "Invalid email or password"

#   Scenario: Login with invalid email
#     Given I open the admin login page
#     When I log in with username "wronguser@example.com" and password "Admin@123"
#     Then I should see an error message "Invalid email or password"

#   Scenario: Login with empty credentials
#     Given I open the admin login page
#     When I log in with username "" and password ""
#     Then I should see an error message "Email and password are required"

#   Scenario Outline: Login with multiple accounts
#     Given I open the admin login page
#     When I log in with username "<email>" and password "<password>"
#     Then I should see the dashboard

#     Examples:
#       | email                 | password   |
#       | admin1@example.com    | Admin@123 |
#       | admin2@example.com    | Secure@456 |
#       | manager@example.com   | Manager@789 |
