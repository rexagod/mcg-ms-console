# Red Hat Data Access Service Console

Data Access Service console is the UI plugin for the Noobaa deployer (Managed Services). It works as a remote module for OpenShift Container Platform (OCP) [console](<(https://github.com/openshift/console)>).

## Running in Development Mode

Data Access Service console works as a remote bundle for OCP console. To run Data Access Service console there should be a instance of OCP console up and running.
Follow these steps to run OCP console in development mode:

1. Follow everything as mentioned in the console [README.md](https://github.com/openshift/console) to build the application.
2. Run the console bridge as follows:

   a. `./bin/bridge -plugins mcg-ms-console=http://localhost:9002/` (if you wish to run Data Access Service only)

   b. `./bin/bridge -plugins odf-console=http://localhost:9001/ -plugins mcg-ms-console=http://localhost:9002/` (in case you have a running instance of ODF)

3. Run development mode of console by going into `console/frontend` and running `yarn run dev`

After the OCP console is set as required by Data Access Service console. Performs the following steps to make it run locally:

1. Clone this repo.
2. Pull all required dependencies by running `yarn install`.
3. `yarn build` to build the plugin, generating output to `dist` directory.
4. `yarn http-server` to start an HTTP server hosting the generated assets, or, run the development mode of mcg-ms-console using `yarn run dev`. This runs a webserver in port 9002.

## E2E Testing

Some E2E tests require certain AWS resources to exist, so in order to run the E2E tests locally, do the following:

1. Create a *.env* file: `cp -n .env.example .env`
2. Put your values for the environment variables in the *.env* file.
