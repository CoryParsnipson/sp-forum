# sp-forum
Experiments in online communication

## TODO

* Implement text selection (deletion, overwriting, click+drag)
* Implement copy and paste
* Save drafts to local storage (or cookie or database)?

* Set up Django models
* Enable anonymous post creation from react component
* Create display of existing posts in chronological order

## Research and references

* [Set up React in your Django Project with webpack](https://medium.com/uva-mobile-devhub/set-up-react-in-your-django-project-with-webpack-4fe1f8455396)
   * install webpack like this:
   ```
   npm install --save-dev webpack webpack-cli 
   ```

   * install react:
   ```
   npm install --save react react-dom
   ```
* [Learning What webpack is and how to config it](https://webpack.js.org/guides/getting-started/)
* [Django webpack loader app](https://github.com/owais/django-webpack-loader)
* [Install react/babel from scratch\*](https://www.valentinog.com/blog/babel/)
   * Install babel in npm like this:

   ```
   npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
   ```
* [Adding the Django CSRF Protection to React Forms](https://www.techiediaries.com/django-react-forms-csrf-axios)

## Setting up the frontend dev environment

1. Create a virtualenv inside the repo:

   ```
   virtualenv venv
   source venv/bin/activate
   ```

2. Install all python dependencies

   ```
   pip install -r requirements
   ```

3. Install all node package dependencies

   ```
   npm install
   ```
