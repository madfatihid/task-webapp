
# task-webapp

Secure web application using Node.js, Express.js, and Sequelize ORM. The application have user registration, login functionality, and profile updating while ensuring proper user access control.
## Usage
1. git clone
2. move to newly created directory and create .env file and add these to the file:

```ruby
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=task-webapp
DB_USERNAME=<CREATE YOUR OWN USERNAME>
DB_PASSWORD=<CREATE YOUR OWN PASSWORD>
ACCESS_TOKEN_SECRET=0fc37d5fa8329c9e9c4fd59a247baf2ab217b1ef9dc31d08fa934b5eb170fc22
REFRESH_TOKEN_SECRET=6f656bb1ac524f51d178992bf510fadbde88fea0dbe0a0a48e2a297f043d9e48
```

3. type `node index.js` to run the application
4. open `localhost:3000`
5. create new account with `/auth/register` by providing username, email, and password parameter
6. use the returned access token as the bearer header
7. access profile by accessing`/profile` with GET request
8. update profile by requesting `/profile` with POST request and username parameter
9. access `/auth/refresh` to get new access token if previous access token expired
10. access `/auth/logout` to logout
10. use`/auth/login` to access again
## Libraries and Stacks Used

-- **Node.js**
-- **Express.js**
-- **Sequelize ORM**
-- **mysql2** (for accessing MySQL database)
-- **dotenv** (for accessing environment variables)
-- **body-parser** (for parsing requests)
-- **cookie-parser** (for parsing cookies)
-- **express-jwt** (for parsing jwt tokens)
-- **jsonwebtoken** (for creating jwt tokens for authorizations)
-- **cors** (for preventing cross-origin resource sharing)
-- **bcrypt** (for hashing passwords)
-- **express-rate-limit** (for blocking DDOS and brute force attacks)

## Endpoints
There are 6 endpoints in this application.
### **POST**  `/auth/register`
Used for creating a new account.
#### Parameters
- `username` string **Required** - only alphanumeric, length from 3 to 32.
- `email` string **Required**
- `password` string **Required** - password must be at least 6 characters, must contain at least 1 number and 1 special character.
#### Response
- `accessToken` string 
### **POST** `/auth/login`
Used for logging in into an existing  account.
#### Parameters
- `email` string **Required**
- `password` string **Required**
#### Response
- `accessToken` string 
### **POST** `/auth/refresh`
Used for refreshing access token. Refresh token will be acceded from the cookie.
### **POST** `/auth/logout`
Used for logging out.
### **GET** `/profile`
Used for viewing the current logged in user profile.
#### Headers
- `Bearer` string **Required** - access token
### **POST** `/profile`
Used for editing/updating the profile username
#### Headers
- `Bearer` string **Required** - access token
#### Parameters
- `password` string **Required**
