const { events, Job } = require("brigadier");
const appInsights = require('applicationinsights');
const settings = require('/home/src/dist/appsettings.json');

appInsights.setup(settings.APPINSIGHTS_INSTRUMENTATIONKEY).start();
var client = appInsights.defaultClient;


client.trackTrace({message: "Brigade invoked"});

events.on("batchfilereceived", (event, project) => {
    client.trackTrace({message: "Brigade event " + event.type + "on branch: " + event.revision.ref + " received with payload: " + event.payload});

    var brigade_payload = JSON.parse(event.payload);

    if(!validate_payload(brigade_payload)) {
        client.trackException({exception: new Error("Could not validate payload: " + brigade_payload.toString())});
        return;
    }

    var job_name = brigade_payload.job_name;
    var image_name = brigade_payload.image_name;

    var job = new Job(job_name, settings.registry + "/" + image_name);
        job.imageForcePull = true;
        job.imagePullSecrets = ["batchappsregistry"];
        job.streamLogs = true;
        job.resourceRequests.memory = "4Gi";
        job.resourceRequests.cpu = "1.5";
        job.resourceLimits.memory = "4Gi";
        job.resourceLimits.cpu = "1.5";

    job.env = brigade_payload.env_vars || {};

    job.run().then((res) => {
        console.log("Brigade event " + event.type + " succeeded");
        client.trackTrace({message: "Brigade event " + event.type + " succeeded"});
    }).catch((err) => {
        console.error("Brigade event " + event.type + " failed with error(s): " + err.toString());
        client.trackException({exception: new Error("Brigade event " + event.type + " failed with error(s): " + err.toString())});
    });
});

function validate_payload(payload) {
    if(!("job_name" in payload)) {
        client.trackException("No job_name provided in payload. Cancelling operation.");
        return false;
    }
    if(!("image_name" in payload)) {
        client.trackException("No image_name provided in payload. Cancelling operation.");
        return false;
    }
    if(!("branch" in payload)) {
        client.trackException("No branch provided in payload. Cancelling operation.");
        return false;
    }
    if(!("SETTINGS_URL" in payload.env_vars)) {
        client.trackException("No SETTNGS_URL provided in payload.env_vars. Cancelling operation.");
        return false;
    }
    if(!("FILE_URL" in payload.env_vars)) {
        client.trackException("No FILE_URL provided in payload.env_vars. Cancelling operation.");
        return false;
    }
    if(!("FILE_NAME" in payload.env_vars)) {
        client.trackException("No FILE_NAME provided in payload.env_vars. Cancelling operation.");
        return false;
    }

    return true;
}


