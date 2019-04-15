const { events, Job } = require("brigadier");
const appInsights = require('applicationinsights');
const settings = require('./appsettings.json');

appInsights.setup(settings.APPINSIGHTS_INSTRUMENTATIONKEY).start();
var client = appInsights.defaultClient;
console.log('HERE')
client.trackTrace({message: "Brigade invoked"});

events.on("exec", (event, project) => {
    client.trackTrace({message: "Brigade event " + event + "received with payload: " + event.payload});
    console.log("EVENT: ", event);
    console.log('PAYLOAD: ', event.payload)
    var mypayload = JSON.parse(event.payload);
    console.log('MY PAYLOAD: ', mypayload);

    console.log('SETTINGS: ', settings);

    var job = new Job("gateway-test", "regbatchapps.azurecr.io/batchapps/generic6");
    job.imagePullSecrets = ["myregistrykey"];

    // job.tasks = [
    //     "cat /scripts/start.sh"
    // ];

    job.env = mypayload;

    job.run().then((res) => {
        console.log('SUCCESS: ', res);
        client.trackTrace({message: "Brigade event " + event + "succeeded"});
    }).catch((err) => {
        client.traceException({exception: new Error("Brigade event " + event + "failed with error(s) " + err.toString())})
        console.log('ERROR: ', err);
    });
});
