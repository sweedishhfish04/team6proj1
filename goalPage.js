// Initialize Firebase
var config = {
    apiKey: "AIzaSyD9CERKrba5PHCeS1in4L6yh1RjA9b1n5o",
    authDomain: "full-fitness-d5c5c.firebaseapp.com",
    databaseURL: "https://full-fitness-d5c5c.firebaseio.com",
    projectId: "full-fitness-d5c5c",
    storageBucket: "full-fitness-d5c5c.appspot.com",
    messagingSenderId: "69235561484"
};
firebase.initializeApp(config);

var fitDB = firebase.database()

// Get logged-in user
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var currentUserID
        currentUserID = user.email.substr(0, user.email.length - 4) // This will be used as a Firebase DB path, and it doesn't like dots

        // Store the user data
        $("#submit").click(() => {
            var userGoals = {
                weightDelta: $("#lb-delta").val(),
                gender: $("#gender").val(),
                weight: $("#weight").val(),
                height: $("#height").val(),
                age: $("#age").val()
            }
            console.log(userGoals)
            fitDB.ref("/users/" + currentUserID + "/userData").set(userGoals).then( () => {
                window.location.href = "personal.html"
            })
        })
        
    } else {
        // No user is signed in.
        $(body).empty()
        $(body).html("No user signed in.  Please click 'Back' to return to the home page to sign in")
    }
})



