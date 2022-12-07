# Recipe system API

API for recipe system

You need psql installed on your machine to run the database and change the password in db.js to your password.  
Download PostgreSQL [Here](https://www.postgresql.org/download/)  
The schema for creating database and tables can be found in [Here](https://github.com/mobak88/recipe-node-app/blob/main/database.sql)

## Connect to database

Open your terminal

### Conect to PSQL

`psql -U postgres`

### Conect to a DATABASE

`\c + DATABASE name`

### Create tables

After you have created the database, copy the schema from database.sql file, everything except for the first line that creates the database, then paste it to your terminal while being conntected to the database. You need to be connected to the database at all times when you request resources from it.

## Default data

The application will check if the default recipes exists in the database when you start the server and create them from defaultRecipes.json if they do not exist

## Endpoints

| Name                 | Request type | Endpoint                                  | Body                                                                                                            |
| -------------------- | ------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Add recipe           | POST         | http://localhost:8080/recipes             | {<br /> "recipe_name": "string",<br />"category": "free"                                                        | "premium",<br />"ingredients": [{ "ingredient_name": "string",<br />"ingredient_category": "string"}],<br />} |
| Add card             | POST         | http://localhost:8080/cards               | {<br /> "card_number": "number",<br />"transaction_store": "string",<br />"transaction_place": "string",<br />} |
| Get card             | GET          | http://localhost:8080/cards/{id}          |                                                                                                                 |
| Get date             | GET          | http://localhost:8080/days/{date}         |                                                                                                                 |
| Get month-year       | GET          | http://localhost:8080/days/{month}/{year} |                                                                                                                 |
| Delete card          | DELETE       | http://localhost:8080/cards/{id}          |                                                                                                                 |
| Get all transactions | GET          | http://localhost:8080/transactions        |
| Get all products     | GET          | http://localhost:8080/products            |

## `start`

You need to be in the root folder or change the start command to fit where you want to start it from.
Start the server.

```
npm run start
# or
yarn start
```

## External packages

- express: Framework for Node.js. [Read more about express](https://www.npmjs.com/package/express)
- Cors: CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options. [Read more about cors](https://www.npmjs.com/package/cors)
- dotenv: Loads environment variables from a .env file into process.env. [Read more about dotenv](https://www.npmjs.com/package/dotenv)
- pg: PostgreSQL client for Node.js. [Read more about pg](https://github.com/brianc/node-postgres)
