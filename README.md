# EC-Auth

A simple authentication service for developers who want to add login and registeration to their application without building the backend from scratch and it will usefull for frontend-only focused devs

EC-Auth lets devs create projects and connect their applications to the authentication API. Instead of writing the same registration and login logic for every project, developer can use the APIs provided by EC-Auth.

Features:
1. Project-Based authentication - keep authentication organised by project
2. User registration - Create accounts using a name, email and password
3. User login - Authentication existing users and receive a token.
4. Token-Based authentication - Use the returned token when making requests to protected endpoints.
5. API integration - Connect EC-Auth to applications built with React, JS or others that can make HTTP requests.
6. Simple integration - Use the API instead of implementing the entir authentication flow yourself

Security:
Password should never be stored as plain text. Keep database credentials and JWT secrets private and don't expose authentication tokens in log 


## To Run in your system:
1. Clone the repo `https://github.com/jaisondavid-m/Easy-Auth`
2. set envs for mysql db connection
3. go to server directory and run `go run main.go`
4. go to client directory and run `npm run dev`
5. Before you need go and node environment