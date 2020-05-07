# Course assistant database

## Developement

Clone this repository and run `npm start` to start the developement containers. The frontend will respond from `localhost:8000`, and the backend from `localhost:8001`.
If new npm packages are installed, run `docker-compose build` before starting.

### Tests
**Note:** The development containers have to be on to setup and run the tests. 

To setup the test db, run `npm run test:setup`.  
Run all tests with `npm run test`.