# Data Federation Console

Data Federation Console is the UI plugin for Noobaa Deployer (Managed Services). It works as a remote module for OpenShift Container Platform [console](<(https://github.com/openshift/console)>).

## Running in Development Mode

Data Federation console works as a remote bundle for OCP console. To run Data Federation Console there should be a instance of OCP console up and running.
Follow these steps to run OCP Console in development mode:

1. Follow everything as mentioned in the console [README.md](https://github.com/openshift/console) to build the application.
2. Run the console bridge as follows `./bin/bridge -plugins dfr-console=http://localhost:9001/`
3. Run developemnt mode of console by going into `console/frontend` and running `yarn run dev`

After the OCP console is set as required by Data Federation Console. Performs the following steps to make it run locally:

1. Clone this repo.
2. Pull all required dependencies by running `yarn install`.
3. `yarn build` to build the plugin, generating output to `dist` directory.
4. `yarn http-server` to start an HTTP server hosting the generated assets.