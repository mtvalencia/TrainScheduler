// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

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
  
  // 2. Button for adding Employees
  $("#addTrain").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var tName = $("#inputTrainName").val().trim();
    var tDestination = $("#inputDestination").val().trim();
    var fTrainTime = $("#inputFirstTrainTime").val().trim();
    var tFrequency = $("#inputFrequency").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: tName,
        destination: tDestination,
        trainTime: fTrainTime,
        frequency: tFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      };
  
    // Uploads employee data to the database
    dataRef.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.trainTime);
    console.log(newTrain.frequency);
    console.log(newTrain.dateAdded);


    // Clears all of the text-boxes
    $("#inputTrainName").val("");
    $("#inputDestination").val("");
    $("#inputFirstTrainTime").val("");
    $("#inputFrequency").val("");
});
  
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  dataRef.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var getTName = childSnapshot.val().name;
    var getTDestination = childSnapshot.val().destination;
    var getTTrainTime = childSnapshot.val().trainTime;
    var getTFrequency = childSnapshot.val().frequency;
    var getDateAdded = childSnapshot.val().dateAdded;
  
    // Employee Info
    console.log(getTName);
    console.log(getTDestination);
    console.log(getTTrainTime);
    console.log(getTFrequency);
    console.log(getDateAdded);

  
    // Prettify the employee start
    // var empStartPretty = moment.unix(empStart).format("MM/DD/YYYY");
  
    // // Calculate the months worked using hardcore math
    // // To calculate the months worked
    // var empMonths = moment().diff(moment(empStart, "X"), "months");
    // console.log(empMonths);
  
    // // Calculate the total billed rate
    // var empBilled = empMonths * empRate;
    // console.log(empBilled);
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(getTName),
      $("<td>").text(getTDestination),
      $("<td>").text(getTFrequency),
      $("<td>").text(getTTrainTime)

    );
  
    // Append the new row to the table
    $("#output").append(newRow);
  });

  
  // Example Time Math
  // -----------------------------------------------------------------------------
  // Assume Employee start date of January 1, 2015
  // Assume current date is March 1, 2016
  
  // We know that this is 15 months.
  // Now we will create code in moment.js to confirm that any attempt we use meets this test case
