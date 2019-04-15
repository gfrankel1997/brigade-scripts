const { events, Job } = require("brigadier");
events.on("simpleevent", (event, project) => {

    console.log("EVENT: ", event);
    console.log('PAYLOAD: ', event.payload)
    var mypayload = JSON.parse(event.payload);
    console.log('MY PAYLOAD: ', mypayload)

    var job = new Job("gateway-test", "regbatchapps.azurecr.io/batchapps/generic3");
    job.imagePullSecrets = ["myregistrykey"];

    // job.tasks = [
    //     "cat /scripts/start.sh"
    // ];

    job.env = mypayload;

    job.run().then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
  });
