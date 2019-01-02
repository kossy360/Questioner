# Questioner API
[![Build Status](https://travis-ci.org/kossy360/Questioner.svg?branch=develop)](https://travis-ci.org/kossy360/Questioner)
[![Coverage Status](https://coveralls.io/repos/github/kossy360/Questioner/badge.svg?branch=develop)](https://coveralls.io/github/kossy360/Questioner?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/783060e3be2b2c154b2b/maintainability)](https://codeclimate.com/github/kossy360/Questioner/maintainability)

This is the main development branch for api endpoints

### Prerequisites

* Node.js

### Installing

All dependencies are provided in the package.json file.
After cloning this branch on your local computer, run this command to install all the project dependencies.

```
npm install
```
Precompile the js files using Babel CLI like so

```
npm run-script build
```
This should precompile all js file and place them in the build folder in the root directory.
Start the server with no-demon for easy debugging 

```
npm run start1
```
Go to your browser, navigate to http://localhost:(yourport)/users/items, you should get a 200 OK response and some JSON objects.

## Running the tests

All tests are run with jasmine and reported with nyc.
Precompile the js files before running any tests.
Run automated tests using

```
npm run test
```

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### Coding style

All javascript code are written in ^ES6 and precompiles to ES5 for node to run. It also adheres to Airbnb style guide.

## Deployment

If you've followed all the instructions above, you should have it up and running with no issues, but should encounter one, do notify me.

## Built With

* VS Code - Text Editor
* Node.js - Environment
* Express - Server
* Jasmine - Test Runner

## Tracking

Follow this project on Pivotal Tracker https://www.pivotaltracker.com/projects/2194061

## Authors

* **Kossy Ugochukwu** 

## Acknowledgments

* Andela
* Amaechi Chisom
