# Data Federation Console

Data Federation console is the UI plugin for the Noobaa deployer (Managed Services). It works as a remote module for OpenShift Container Platform [console](<(https://github.com/openshift/console)>).

## Running in Development Mode

Data Federation console works as a remote bundle for OCP console. To run Data Federation console there should be a instance of OCP console up and running.
Follow these steps to run OCP console in development mode:

1. Follow everything as mentioned in the console [README.md](https://github.com/openshift/console) to build the application.
2. Run the console bridge as follows:

    a. `./bin/bridge -plugins dfr-console=http://localhost:9002/` (if you wish to run data federation only)

    b. `./bin/bridge -plugins odf-console=http://localhost:9001/ -plugins dfr-console=http://localhost:9002/` (in case you have a running instance of odf)
3. Run development mode of console by going into `console/frontend` and running `yarn run dev`

After the OCP console is set as required by Data Federation console. Performs the following steps to make it run locally:

1. Clone this repo.
2. Pull all required dependencies by running `yarn install`.
3. `yarn build` to build the plugin, generating output to `dist` directory.
4. `yarn http-server` to start an HTTP server hosting the generated assets, or, run the development mode of dfr-console using `yarn run dev`. This runs a webserver in port 9002.
