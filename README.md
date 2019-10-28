# sp-forum
Experiments in online communication

## TODO

* need to fix bug where cursor pre-maturely goes onto a new line when adding characters close to the right margin of a post.

### Goals necessary for deployment demo:

* Support for static files (images, videos, etc) - use Whitenoise with Amazon Cloudfront as CDN?
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

4. Create a local file called dev.keyring in the /backend directory that contains the following variables:
   
   ```
   alias deploy="git subtree push --prefix=backend heroku  master"

   export SECRET_KEY='<django_secret_key>'
   export SERVER_MODE='development'
   ```

## Setting up the prod environment

1. Do all the steps for the dev environment

2. Create a local file called prod.keyring in the /backend directory that contains the following variables:
   
   ```
   export SECRET_KEY='<django_secret_key>'
   export SERVER_MODE='production'
   export ALLOWED_HOSTS='localhost .domainname.com' # this is converted to a list, separate entries with spaces
   ```

3. Add heroku origin to the repo

   ```
   heroku git:remote -a <herokuapp>
   ```

   You can also rename the heroku origin to something else if there are multiple.
   E.g. heroku-dev heroku-staging heroku-prod

   ```
   git remote rename heroku heroku-dev
   ```

4. Since the django app is not in the root directory, heroku is unable to automatically recognize it. A
   solution to this is to use git subtree to push only the /backend directory to the heroku app.

   NOTE: that `git subtree` must be run from the root directory of this repo.

   ```
   sudo dnf install git-subtree
   git subtree push --prefix backend heroku master
   ```
