// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train - then update the html + update the database
// 3. Create a way to retrieve traininfo from the database.
// 4. Create a way to calculate the time. Using difference between start and current time.
//    Then use moment.js formatting to set all the time.
// 5. Calculate minuts away

// Initialize Firebase
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

// Create Button for adding train
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grab user inputs
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = $("#start-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();

  // Create local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  // Uploads train data to the database
  database.ref().push(newTrain);
  // Logs everything to console
  // console.log(newTrain.name);
  // console.log(newTrain.destination);
  // console.log(newTrain.start);
  // console.log(newTrain.frequency);
  // alert("new train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
}); //end adding train

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainNameI = childSnapshot.val().name;
  var trainDestinationI = childSnapshot.val().destination;
  var trainFirstStartI = childSnapshot.val().start;
  var trainFrequencyI = childSnapshot.val().frequency;

  // First train time
  var trainOne = moment(trainFirstStartI, "hh:mm");
  // Calculate the time between now and the firstOne in minutes
  var diff = moment().diff(moment(trainOne), "minutes");
  // console.log("dif time: " + diff);
  // Calculate the time is left based on how frequently it comes in minutes
  var timeRemaining = diff % trainFrequencyI;
  console.log("remaining time: " + diff);
  var minsAway = trainFrequencyI - timeRemaining;
  var trainTwo = moment().add(minsAway, "minutes")
  var newArrival = (moment(trainTwo, 'ddd DD-MMM-YYYY, hh:mm A').format('hh:mm A'));

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainNameI),
    $("<td>").text(trainDestinationI),
    $("<td>").text(trainFirstStartI),
    $("<td>").text(trainFrequencyI),
    $("<td>").text(newArrival),
    $("<td>").text(minsAway)
  );

  // Append the new row to the table
  $("#train-table").append(newRow);
});

// Clear submitted info
$("#clear").on("click", function (event) {
  event.preventDefault();
  $("td").empty();
})