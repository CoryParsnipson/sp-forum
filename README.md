# sp-forum
Experiments in online communication

## TODO

* need to fix bug where cursor pre-maturely goes onto a new line when adding characters close to the right margin of a post.

### Goals necessary for deployment demo:

* Secure REST API endpoints
* Captcha support
* Rate limit posting?

### Future Goals

* Admin control panel
   * Forum creation outside Django admin?

* User control panel
   * edit profiles and stuff?

* Beef up user authentication
   * Make it possible for users to "reclaim" posts? (automatically through finding old posts in user storage and manually through trip codes?)

* Support for static files (images, videos, etc) - use WhiteNoise?

* Implement text selection (deletion, overwriting, click+drag)
* Implement copy and paste
* Save drafts to local storage (or cookie or database)?

* Figure out how to fucking use DRF (why do I feel like I'm the only one who thinks this framework is terrible?)

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

* [WTF is SASS/SCSS and how do I use it??](https://marksheet.io/sass-scss-less.html)
* [Install Sass and sass-loader through NPM](https://www.npmjs.com/package/sass-loader)

* [How to Expose Webpack Bundle as Library](https://stackoverflow.com/questions/34357489/calling-webpacked-code-from-outside-html-script-tag)
* [Dealing with Multiple webpack entries and outputs](https://stackoverflow.com/questions/34378321/dynamic-library-option-with-multi-entry-points)

## Setting up the dev environment

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
