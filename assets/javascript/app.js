(function () {
  // These are the constraints used to validate the form
  var constraints = {
    inputTrainName: {
      // Train name is required
      presence: true,
    },
    inputDestination: {
      // Destination is required
      presence: true,
    },
    inputFirstTrainTime: {
      // Train time is required
      presence: true,

      format: {
        //Only allow numbers
        pattern: "[0-9]+",

        message: "Only use numbers"
      }
    },
    inputFrequency: {
      // Frequency is required
      presence: true,
    }
  };

  var form = document.querySelector("form#main");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    handleFormSubmit(form);
  });

  var inputs = document.querySelectorAll("input, textarea, select")
  for (var i = 0; i < inputs.length; ++i) {
    inputs.item(i).addEventListener("change", function (ev) {
      var errors = validate(form, constraints) || {};
      showErrorsForInput(this, errors[this.name])
    });
  }

  function handleFormSubmit(form, input) {

    var errors = validate(form, constraints);

    showErrors(form, errors || {});
    if (!errors) {
      showSuccess();
    }
  }

  function showErrors(form, errors) {

    _.each(form.querySelectorAll("input[name], select[name]"), function (input) {

      showErrorsForInput(input, errors && errors[input.name]);
    });
  }

  function showErrorsForInput(input, errors) {

    var formGroup = closestParent(input.parentNode, "form-group")

      ,
      messages = formGroup.querySelector(".messages");

    resetFormGroup(formGroup);

    if (errors) {
      // we first mark the group has having errors
      formGroup.classList.add("has-error");

      _.each(errors, function (error) {
        addError(messages, error);
      });
    } else {

      formGroup.classList.add("has-success");
    }
  }

  function closestParent(child, className) {
    if (!child || child == document) {
      return null;
    }
    if (child.classList.contains(className)) {
      return child;
    } else {
      return closestParent(child.parentNode, className);
    }
  }

  function resetFormGroup(formGroup) {
    // Remove the success and error classes
    formGroup.classList.remove("has-error");
    formGroup.classList.remove("has-success");
    // and remove any old messages
    _.each(formGroup.querySelectorAll(".help-block.error"), function (el) {
      el.parentNode.removeChild(el);
    });
  }

  function addError(messages, error) {
    var block = document.createElement("p");
    block.classList.add("help-block");
    block.classList.add("error");
    block.innerText = error;
    messages.appendChild(block);
  }

  function showSuccess() {

    alert("Success! You added a train to the schedule");
  }
})();

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

// 2. Button for adding Trains
$("#addTrain").on("submit", function (event) {
  event.preventDefault();

  // Grabs user input
  var tName = $("#inputTrainName").val().trim();
  var tDestination = $("#inputDestination").val().trim();
  var fTrainTime = $("#inputFirstTrainTime").val().trim();
  var tFrequency = $("#inputFrequency").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: tName,
    destination: tDestination,
    trainTime: fTrainTime,
    frequency: tFrequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  // Uploads train data to the database
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

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
dataRef.ref().on("child_added", function (childSnapshot) {
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

  //Train time calculations 

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(getTTrainTime, "HH:mm").subtract(1, "years");

  // Current Time
  var currentTime = moment();

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  // Time apart (remainder)
  var tRemainder = diffTime % getTFrequency;
  console.log(tRemainder);

  // Minute Until Train Arrives
  var tMinutesTillTrain = getTFrequency - tRemainder;

  // Next Train Arrival Time
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var getNextTrain = moment(nextTrain).format("hh:mm A");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(getTName),
    $("<td>").text(getTDestination),
    $("<td>").text(getTFrequency),
    $("<td>").text(getNextTrain),
    $("<td>").text(tMinutesTillTrain)

  );

  // Append the new row to the table
  $("#output").append(newRow);
});