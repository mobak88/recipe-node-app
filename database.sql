CREATE DATABASE recipes_system;

CREATE TABLE recipe(
    recipe_id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL
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
    step_name VARCHAR(255) NOT NULL,
    UNIQUE(recipe_id)
);

