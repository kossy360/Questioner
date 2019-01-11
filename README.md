# Questioner API
[![Build Status](https://travis-ci.org/kossy360/Questioner.svg?branch=develop)](https://travis-ci.org/kossy360/Questioner)
[![Coverage Status](https://coveralls.io/repos/github/kossy360/Questioner/badge.svg?branch=develop)](https://coveralls.io/github/kossy360/Questioner?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/783060e3be2b2c154b2b/maintainability)](https://codeclimate.com/github/kossy360/Questioner/maintainability)

This is the main development branch for api endpoints

### Prerequisites

* Node.js

### Installing

All dependencies are provided in the package.json file.
After cloning this branch on your local computer navigate to into the questioner repository.

```
-cd
``` 
Install all npm modules by running

```
npm install
```
Start the server like so

```
npm run start1
```
## Running the tests

All tests are run with jasmine and reported with nyc.
Run automated tests using

```
npm run test
```
Before running the test, make sure you don't have the server running. This will cause an error as the test runner starts the server before running the tests.

## Testing with POSTMAN

When testing endpoints with POSTMAN, please ensure to add a **'auth'** header with a value of either **admin** or **user**
Most of the routes do not explicitly require this header, but some routes are only accessible when the header is set to a particular value

```
POST hostname/api/v1/meetups
```
requires the auth header to be set to admin

```
POST hostname/api/v1/rsvps
```
requires the auth header to be set to user

This is going to be changed when the API are secured with JWT, so watch out for updates.

### Coding style

All javascript code are written in ^ES6 and precompiles to ES5 for node to run. It also adheres to Airbnb style guide.

## Deployment

**Local**

If you've followed all the instructions above, you should have it up and running with no issues, but should encounter one, do notify me.

**Heroku**

https://k-questioner.herokuapp.com/api/v1/

## Built With

* VS Code - Text Editor
* Node.js - Environment
* Express - Server
* Jasmine - Test Runner

## Tracking

Follow this project on Pivotal Tracker https://www.pivotaltracker.com/n/projects/2232054

## Authors

* **Kossy Ugochukwu** 

## Acknowledgments

* Andela
* Amaechi Chisom
* Taiwo Sanni
