**Multiple Chatbot AI Provider Backend System**

This project is a backend system built on NodeJS Express and MySQL, supporting multiple chatbot AI providers,
specifically Watson and Google Dialogflow. The system allows for the integration and management of these chatbots,
providing a user interface for interaction.

**Features**

**Multiple Chatbot Support:** Currently supports IBM Watson and Google Dialogflow.

**Database Integration:** Uses MySQL and optionally PostgreSQL for logging conversation details.

**Sequelize ORM:** Facilitates database operations.

**User Interface:** Accessible through specific paths for each chatbot.

**Getting Started**

**Prerequisites**

Ensure you have the following installed:

NodeJS

MySQL Workbench (or PostgreSQL)

VSCode or any other IDE

**Installation**

Clone the repository:

**git clone https://github.com/subrat25/test_chatbot_template.github.io.git**

Install dependencies:

npm install

Create your credentials JSON file for the chatbots in the creds folder. A samplecredentials JSON file is available for reference.

Create a .env file:

Add your database configuration in the .env file. You can refer to the .env sample file for guidance:


MYSQL_HOST=localhost

MYSQL_DB=DB_name

MYSQL_USER=test_user

MYSQL_PASSWORD=test_user_password

POSTGRES_HOST=your_postgres_host

POSTGRES_DB=your_postgres_db

POSTGRES_USER=your_postgres_user

POSTGRES_PASSWORD=your_postgres_password

POSTGRES_USE=false  # Change to true if you want to use PostgreSQL



**Update Bot ID in the UI:**

Update the Bot ID as per your convenience in the HTML files located in the UIs folder.

**Running the Application**

To start the server, run:

**npm start** or

**npm install** and **node index.js**

The UI can be accessed at:

Watson Chat: http://localhost:3000/watsonchat 

Google Dialogflow Chat: http://localhost:3000/gdfchat

**Database Configuration**

Needs a user with DBA permissions. Tables will be automatically created.

The system supports both MySQL and PostgreSQL. Configure your database connection details in the .env file. Sequelize ORM is used for database operations.

**Folder Structure**

creds/: Contains your credentials JSON file for the chatbots.

.env: Environment variables for database configuration.

UI/: Static files and UI HTML files.

Config/: Contains the bot configuration and database configuration for the backend system.

Model/: Contains models for Sequelize ORM.

index.js: The main file that runs the server.

dialogflow.js: Contains the logic for Dialogflow-based conversations.

watson.js: Contains the logic for Watson-based conversations.
