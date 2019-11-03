// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyBnuX3nM29w68p3l23bQWU4lUxnN8BRp28",
  authDomain: "pei-s-test.firebaseapp.com",
  databaseURL: "https://pei-s-test.firebaseio.com",
  projectId: "pei-s-test",
  storageBucket: "pei-s-test.appspot.com",
  messagingSenderId: "871904580444",
  appId: "1:871904580444:web:1a887460bab98954066799",
  measurementId: "G-Z79RRWNY74"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding tran
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = $("#start-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency,
    // dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  alert("new train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  // // Train Info
  // console.log(trainName);
  // console.log(trainDestination);
  // console.log(trainStart);
  // console.log(trainFrequency);

  // Prettify the employee start
  var trainArrival = moment(trainStart, "hh:mm");

  var difference = moment().diff(moment(trainArrival), "minutes");

  var timeRemaining = difference % trainFrequency;

  var minsAway = trainFrequency - timeRemaining;

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainStart),
    $("<td>").text(trainFrequency),
    $("<td>").text(minsAway),
  );

  // Append the new row to the table
  $("#train-table").append(newRow);
});

$("#clearInput").on("click", function (event) {
  event.preventDefault();
  $("td").empty();
})

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case