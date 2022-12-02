CREATE DATABASE recipes_system;

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
    step_text VARCHAR(255) NOT NULL
);

insert into recipe (recipe_name, category) values ('Easy Pancakes', 'free');

insert into ingredient (fk_recipe, ingredient_name, ingredient_category) values (1, '100g plain flour', 'flour');

insert into step (fk_recipe, step_text) values (1, 'Put 100g plain flour, 2 large eggs, 300ml milk, 1 tbsp sunflower or vegetable oil and a pinch of salt into a bowl');