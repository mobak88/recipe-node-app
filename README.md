# Recipe system API

API for recipe system

You need psql installed on your machine to run the database and change the password variable in db.js to the password you set when you installed postgres.  
Download PostgreSQL [Here](https://www.postgresql.org/download/)  
The schema for creating database and tables can be found in [Here](https://github.com/mobak88/recipe-node-app/blob/main/database.sql)

## Connect to database

Open your terminal

### Conect to PSQL

Paste in `psql -U postgres` to connect to PSQL

```
psql -U postgres
```

### Create database

Paste in `CREATE DATABASE recipes_system` to connect to PSQL

```
CREATE DATABASE recipes_system;
```

### Conect to a DATABASE

Paste in `\c + DATABASE name` to connect to database. If you copied the database name from the schema paste code below to connext to the database:

```
\c recipes_system;
```

### Create tables

After you have created the database, copy the schema from database.sql file, everything except for the first line that creates the database, then paste it to your terminal while being conntected to the database. You need to be connected to the database at all times when you request resources from it.  
Tables schema:

```
CREATE TABLE recipe(
    recipe_id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) CHECK (category in ('free', 'premium')) NOT NULL
);

CREATE TABLE ingredient(
    ingredient_id SERIAL PRIMARY KEY,
    fk_recipe INT REFERENCES recipe (recipe_id) NOT NULL,
    ingredient_name VARCHAR(255) NOT NULL,
    ingredient_category VARCHAR(255) NOT NULL
);

CREATE TABLE step(
    step_id SERIAL PRIMARY KEY,
    fk_recipe INT REFERENCES recipe (recipe_id) NOT NULL,
    step_text TEXT NOT NULL
);
```

## `install`

This command installs the packages that the project depends on.

```
npm install
```

or

```
yarn install
```

## `start`

You need to be in the root folder or change the start command to fit where you want to start it from.  
Start the server:

```
npm run start
```

or

```
yarn start
```

## Default data

The application will check if the default recipes exists in the database when you start the server and create them from defaultRecipes.json if they do not exist

## Endpoints

You can change the port variable in app.js to change the port if you wish to.

### Available to all users

The application will only show results for free recipes to user if the user are not logged in as a premium user or admin

| Name                          | Request type | Endpoint                                            |
| ----------------------------- | ------------ | --------------------------------------------------- |
| Get all recipes               | GET          | http://localhost:8080/recipes                       |
| Get recipe                    | GET          | http://localhost:8080/{recipe_id}                   |
| Get recipe with all details   | GET          | http://localhost:8080/{recipe_id}/all               |
| Get single step by step id    | GET          | http://localhost:8080/:recipe_id/{step_id}          |
| Get single step by step count | GET          | http://localhost:8080/:recipe_id/steps/{step_count} |
| Post login                    | POST         | http://localhost:8080/login                         |

#### Get single step by count

To get a single step by count you just provide it with the step number, for example if you want the first step you send a GET request to the `/:recipe_id/steps/{step_count}` resource like this: `http://localhost:8080/:1/steps/1` in this example you get the first step for that recipe. The reason I chose this aproach is because it did not make sense to me to make the user find the step id and this aproach is much more user friendly.

#### Login example

To login send POST request to the `/login` resource with a `user_type` and `admin` as string or `user_type` and `premium` as string with Content-Type JSON, you get authorized to the respective resourses after logging in. Login are cookies, remove cookie `user_type` to logout

```
{
    "user_type": "admin"
}
```

### Available to premium users and admin

| Name                                  | Request type | Endpoint                                  |
| ------------------------------------- | ------------ | ----------------------------------------- |
| Get all recipes with ingredient       | GET          | http://localhost:8080/search/{ingredient} |
| Get list of all available ingredients | GET          | http://localhost:8080/ingredients         |

### Available to admin

#### Add recipe

| Name          | Request type | Endpoint                      |
| ------------- | ------------ | ----------------------------- |
| Post a recipe | POST         | http://localhost:8080/recipes |

To add a recipe send a POST request to the `/recipes` resource with a Content-Type JSON as in the example below. You must provide:

- `recipe_name` as string
- `category` as string must be either `free` or `premium`
- ingredients as an array of objects with at least one object containing `ingredient_name` as string and `ingredient_category` as string
- steps as an array of objects with at least one object containing `step_text` as string

#### Add recipe example

```
{
    "recipe_name": "rice",
    "category": "free",
    "ingredients": [
        {
            "ingredient_name": "rice",
            "ingredient_category": "rice"
        },
        {
            "ingredient_name": "salt",
            "ingredient_category": "salt"
        }
    ],
    "steps": [
        {
            "step_text": "Boil water"
        },
        {
            "step_text": "Add salt and rice"
        }
    ]
}
```

#### Update Recipe

| Name           | Request type | Endpoint                                 |
| -------------- | ------------ | ---------------------------------------- |
| Patch a recipe | PATCH        | http://localhost:8080/recipes/:recipe_id |

To update a recipe send a PATCH request to the `/recipes/:recipe_id` resource with a with Content-Type JSON as in the example below. If you add more ingredients or steps than that exists from before it will create new ingredients/steps, if you provide it the respective ingredients and or steps they will get updated. It ignores everything you leave out and updates only what you provide. New ingreedients must have `ingredient_name` as string and `ingredient_category` as string. New steps must have `step_text` as string.

- `recipe_name` as string
- `category` as string must be either `free` or `premium`
- ingredients as an array of objects with at least one object containing `ingredient_name` as string and or `ingredient_category` as string
- steps as an array of objects with at least one object containing `step_text` as string

#### Update recipe example

```
{
    "recipe_name": "rice",
    "category": "free",
    "ingredients": [
        {
            "ingredient_name": "rice",
            "ingredient_category": "rice"
        },
        {
            "ingredient_name": "salt",
            "ingredient_category": "salt"
        }
    ],
    "steps": [
        {
            "step_text": "Boil water"
        },
        {
            "step_text": "Add salt and rice"
        }
    ]
}
```

#### Replace Recipe

| Name         | Request type | Endpoint                                 |
| ------------ | ------------ | ---------------------------------------- |
| Put a recipe | PUT          | http://localhost:8080/recipes/:recipe_id |

To replace a recipe send a PUT request to the `/recipes/:recipe_id` resource with a Content-Type JSON as in the example below.

- `recipe_name` as string
- category as string must be either `free` or `premium`
- ingredients as an array of objects with at least one object containing `ingredient_name` as string and `ingredient_category` as string
- steps as an array of objects with at least one object `containing step_text` as string

#### Replace recipe example

```
{
    "recipe_name": "rice",
    "category": "free",
    "ingredients": [
        {
            "ingredient_name": "rice",
            "ingredient_category": "rice"
        },
        {
            "ingredient_name": "salt",
            "ingredient_category": "salt"
        }
    ],
    "steps": [
        {
            "step_text": "Boil water"
        },
        {
            "step_text": "Add salt and rice"
        }
    ]
}
```

#### Delete recipe

To delete a recipe send a DELETE request to the `/recipes/:recipe_id` resource. It will delete the recipe and all ingredients and steps related to it.

| Name            | Request type | Endpoint                                 |
| --------------- | ------------ | ---------------------------------------- |
| Delete a recipe | DELETE       | http://localhost:8080/recipes/:recipe_id |

## External packages

- express: Framework for Node.js. [Read more about express](https://www.npmjs.com/package/express)
- Cors: CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options. [Read more about cors](https://www.npmjs.com/package/cors)
- dotenv: Loads environment variables from a .env file into process.env. [Read more about dotenv](https://www.npmjs.com/package/dotenv)
- pg: PostgreSQL client for Node.js. [Read more about pg](https://github.com/brianc/node-postgres)
- cookie-parser: Parse Cookie header and populate `req.cookies`. [Read more about cookie-parser](https://www.npmjs.com/package/cookie-parser)
