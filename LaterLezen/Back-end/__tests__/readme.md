# Tests

## Unit test

### Article 

- Find specific article
- Check if article url is a valid article
- Keep part of metadata of an article filled, even when empty
  - Only when creating a new article
- Edit multiple metadata from a specific article
- Edit article and submit only empty fields

### User
- Email format
  - Check if email format is correct
- Password hashing
  - Check if the password is correctly hashed and not saved as plain text
- Add correct article object to user
  - This test creates a new article on a user account 
- Add new theme to user 
- Theme stays on the current theme when changing it to a invalid theme


## Integration tests

### User
- Register without password
- Register user 
- Register user with duplicate emailaddress
- Logout without logging in
- Login with wrong email
- Login with wrong password
- Login with right email and password

## End to End tests
- User tries to register a new account, where the passwords do not match
- User registers a new account that already exists
- User registers a new account that does not exist yet
- User clicks the hamburger menu and selects the option to safe an article
- User clicks an article to read
- User logs out of the LaterLezer app
- User logs in the webpage with wrong password
- User logs in the webpage with right password

## To be tested
- Tags
- **Add tag to user (!OUDE TEST)**
- **Check for duplicate tags (!OUDE TEST)**
- **User clicks on edit article in the dashboard(!OUDE TEST)**

