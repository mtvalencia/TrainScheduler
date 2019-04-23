// Initialize Firebase
var config = {
    apiKey: "AIzaSyBSLlkVR1Jl9YBPSBa4DC5PMq6vtRagBz0",
    authDomain: "mtvtrainscheduler.firebaseapp.com",
    databaseURL: "https://mtvtrainscheduler.firebaseio.com",
    projectId: "mtvtrainscheduler",
    storageBucket: "mtvtrainscheduler.appspot.com",
    messagingSenderId: "471958968460"
  };
  firebase.initializeApp(config);

  var dataRef = firebase.database();

      // Initial Values
      var tName = "";
      var destination = "";
      var fTrainTime = "";
      var frequency = "";

    // Capture Button Click
    $("#addTrain").on("click", function(event) {
        event.preventDefault();

    // Code in the logic for storing and retrieving the most recent user.
    // Don't forget to provide initial data to your Firebase database.
    tName = $("#inputTrainName").val().trim();
    destination = $("#inputDestination").val().trim();
    fTrainTime = $("#inputFirstTrainTime").val().trim();
    frequency = $("#inputFrequency").val().trim();

      // Code for the push
      dataRef.ref().push({

        tName: tName,
        destination: destination,
        fTrainTime: fTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });

    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    dataRef.ref().on("child_added", function(childSnapshot) {

        // Log everything that's coming out of snapshot
        console.log(childSnapshot.val().tName);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().fTrainTime);
        console.log(childSnapshot.val().frequency);
        console.log(childSnapshot.val().dateAdded);
  
        // // full list of items to the well
        $("#tName-display").append("<td> + childSnapshot.val.tName + </td>");
        $("#destination-display").append("<td> + childSnapshot.val.destination + </td>");
        $("#frequency-display").append("<td> + childSnapshot.val.frequency + </td>");

      // full list of items to the well
    //   $("#output").append("<div class='well'><span class='train-name'> " +
    //     childSnapshot.val().tName +
    //     " </span><span class='train-destination'> " + childSnapshot.val().destination +
    //     " </span><span class='train-frequency'> " + childSnapshot.val().frequency +
    //     " </span></div>");

      // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
  
      dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        // Change the HTML to reflect
        $("#tName-display").text(snapshot.val().tName);
        $("#destination-display").text(snapshot.val().destination);
        $("#frequency-display").text(snapshot.val().frequency);
      });