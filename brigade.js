const { events, Job } = require("brigadier");
events.on("test-event-type", (event, project) => {
    console.log(event)
    console.log(project)
    // var job = new Job("blah-test", "regbatchapps.azurecr.io/batchapps/kubernetes");

    // job.tasks = [
    //     "cat /scripts/start.sh"
    // ];

    // job.env = {
    //     "DOWNLOAD_FILE": "False",
    //     "APP_PATH": "/apps/ADF",
    //     "BATCH_COMMAND": "Beyond.Compensation.AutoReview.Console.dll",
    //     "ASPNETCORE_ENVIRONMENT": "development",
    //     "APP_COMMAND": "dotnet",
    //     "LOG_FILE_NAME": "blah2.txt"
    // };

    // job.run().then((res) => {
    //     console.log(res);
    // }).catch((err) => {
    //     console.log(err);
    // });
  });