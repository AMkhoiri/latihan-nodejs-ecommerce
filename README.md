# Project Name: Simple Node.js E-commerce API

## Project Description:
This project is an API designed to facilitate the process of selling goods in a business. The API provides basic features commonly found in similar applications, such as product management, user management, discount capabilities, shopping carts, ordering, payment, shipping, and more. The goal of this project/API is to be implemented in web or mobile applications.

As this is my first project developed using Node.js technology, I am aware that it has limitations and potential for further development. Some potential future developments include additional features like notifications, product recommendations, more complex product filtering, chat, integration with payment gateways, and a product review system. Throughout the development process, I strive to create a modular folder structure and codebase, making it easier for future development.

## Packages and Technologies:
The following is a list of packages, frameworks, programming languages, and technologies used in this project:

### Programming Language:
- Node.js: v18.15.0. (Javascript)

### Framework:
- Express.js

### Database:
- PostgreSQL

### Packages:
- bcrypt
- express-validator
- jsonwebtoken
- multer
- node-cron
- node-fetch
- sequelize
- and more

### Integration with External Services:
This project utilizes an external service from RajaOngkir for the shipping feature. RajaOngkir is an API that provides shipping cost information from various delivery services in Indonesia. This API is used in the project to calculate shipping cost estimates and obtain accurate shipping information. To use the shipping feature, you need to register and obtain an API key from RajaOngkir.

### Supporting Tools:
- Postman: Used for testing and documenting the API
- VS Code: Used as a code editor
- Sublime Text: Used as a code editor
- Git: Used for version control of the project
- Database Management Tools like Navicat, DBeaver
- and more

## Important Notes:

1. This project implements the use of ES modules in almost all parts of the application. However, for the migration part, CommonJS is used. Therefore, when running the migration, you need to change the module type in the `package.json` file to "commonjs". Once the migration is complete, you can change it back to "module" for normal application usage.

2. Before running this application, make sure to set the required environment variables. You need to create a `.env` file based on the provided `.env.example`. This `.env` file will contain specific configurations such as API keys, database settings, and other necessary settings in the application.

Here are the steps to set up the `.env` file:

- Duplicate the `.env.example` file and name it `.env`.
- Open the `.env` file and fill in the variable values according to the configuration relevant to your environment. Make sure to store correct and relevant values, such as the RajaOngkir API key, database settings, and other required settings.

## Contact Information

For any inquiries or further information about this project, feel free to reach out to me:

- Email: ahmad.m.khoiri@gmail.com