const { events, Job } = require("brigadier");
events.on("simpleevent", (event, project) => {

    console.log("EVENT: ", event);
    console.log('PAYLOAD: ', event.payload)

    var job = new Job("gateway-test", "regbatchapps.azurecr.io/batchapps/generic");

    job.tasks = [
        "cat /scripts/start.sh"
    ];

    job.env = {
        "APP_URL": event.payload.APP_URL
    };

    // job.env = {
    //     "DOWNLOAD_FILE": "False",
    //     "APP_PATH": "/apps/PostCAM",
    //     "BATCH_COMMAND": "Beyond.Compensation.AutoReview.Console.dll",
    //     "ASPNETCORE_ENVIRONMENT": "development",
    //     "APP_COMMAND": "dotnet",
    //     "LOG_FILE_NAME": "blah2.txt"
    // };

    job.run().then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
  });