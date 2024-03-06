# family-space-test-task

This project is a TypeScript + PostgreSQL + Express API Server.

## Scripts
- `start`: Run `npm run build` and then start the server with `node dist/server.js`
- `dev`: Run the server in development mode with `NODE_ENV=development` using nodemon
- `build`: Compile TypeScript files using `tsc` and `tsc-alias`
- `db:init`: Start the PostgreSQL database using docker-compose and the `.env` file
- `test`: Run tests with Jest and force exit on completion
- `lint`: Lint TypeScript files in the `src` directory using eslint, ignoring paths specified in `.gitignore`
- `lint:fix`: Run linting and automatically fix issues with `--fix`

## Documentation

This project includes Swagger documentation for the REST API. You can access the API documentation by navigating to `/api-docs` after starting the server.

The Swagger documentation provides details about the available endpoints, request and response schemas, and example usage.

To view the documentation, start the server and open your web browser to [http://localhost:3000/api-docs](http://localhost:3000/api-docs).