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
        var currentUserID = user.email.substr(0, user.email.length - 4) // This will be used as a Firebase DB path, and it doesn't like dots
        fitDB.ref("/users/" + currentUserID).on("value", (userInfo) => {
            let userDataValid = userInfo.hasChild("userData")
            let nutDataValid = userInfo.hasChild("nutrition")

            if (!userDataValid) { return } // Don't try to print goals if none have been entered

            let userData = userInfo.child("userData").val()
            let nutData = userInfo.child("nutrition").val()

            // Compute caloric goal based on user-entered data using the Mifflin - St Jeor Formula
            let weightKg = userData.weight / 2.2046
            let heightCm = userData.height / 0.39370
            let genderStr = userData.gender
            let calorieGoal = (10 * weightKg) + (6.25 * heightCm) - (5 * userData.age)
            let sugarGoal = 0
            let proteinGoal = 0
            if (genderStr === "FEMALE") {
                calorieGoal -= 161
                sugarGoal = 25
                proteinGoal = 46
            } else if (genderStr === "MALE") {
                calorieGoal += 5
                sugarGoal = 38
                proteinGoal = 56
            }
            calorieGoal += (userData.weightDelta * 200)

            // Calculate carb goal (55% of calories from carbs, and 4 calories/gram of carb)
            let carbGoal = (.55 * calorieGoal) / 4

            // Calculate fat goal (30% of calories from fat, and 9 calories/gram of fat)
            let fatGoal = (.30 * calorieGoal) / 9

            // Display current goals
            let deltaStr = ""
            if (userData.weightDelta > 0) {
                deltaStr = "gain " + Math.abs(userData.weightDelta) + " pounds"
            } else if (userData.weightDelta < 0) {
                deltaStr = "lose " + Math.abs(userData.weightDelta) + " pounds"
            } else {
                deltaStr = "maintain my weight"
            }
            let goalStr = "Given that I want to " + deltaStr + " each week, my daily caloric goal is:"

            let goalDiv = $("#goal-stmt")
            goalDiv.empty()
            goalDiv.append($("<p>").text(goalStr))
            goalDiv.append($("<h4>").text(Math.floor(calorieGoal)).attr("class", "text-center"))
            goalDiv.append($("<p>").text("My daily protein intake goal is: (g)"))
            goalDiv.append($("<h4>").text(Math.floor(proteinGoal)))
            goalDiv.append($("<p>").text("My daily fat intake goal is: (g)"))
            goalDiv.append($("<h4>").text(Math.floor(fatGoal)))
            goalDiv.append($("<p>").text("My daily carbohydrate intake goal is: (g)"))
            goalDiv.append($("<h4>").text(Math.floor(carbGoal)))
            goalDiv.append($("<p>").text("My daily added sugar intake must not exceed: (g)"))
            goalDiv.append($("<h4>").text(Math.floor(sugarGoal)))
            goalDiv.append($("<p>").text("Exercise: (min)"))
            goalDiv.append($("<h4>").text("30"))

            // Display progress chart
            if (!nutDataValid) { // Don't try to display nutrition info if none has been entered, initialize DB instead
                fitDB.ref("/users/" + currentUserID + "/nutrition").set({
                    calories: 0,
                    protein: 0,
                    fat: 0,
                    carb: 0,
                    sugar: 0
                })
                return 
            } 
            let curCal = nutData.calories
            let curCarb = nutData.carb
            let curFat = nutData.fat
            let curProtein = nutData.protein
            let curSugar = nutData.sugar

            let progStr = "Calories: " + curCal + " | Carbs (g): " + Math.floor(curCarb) + " | Fat (g): " + Math.floor(curFat) + " | Protein (g): " + Math.floor(curProtein) + " | Sugar (g): " + Math.floor(curSugar)
            $("#progress").text(progStr).attr("class", "text-center")

            var progChart = new Chart($("#prog-chart"), {
                    type: 'bar',
                    data: {
                        labels: ["Calories", "Protein", "Fat", "Carbohydrate", "Sugar"],
                        datasets: [{
                            label: '% of DV',
                            data: [(curCal / calorieGoal) * 100,
                            (curProtein / proteinGoal) * 100,
                            (curFat / fatGoal) * 100,
                            (curCarb / carbGoal) * 100,
                            (curSugar / sugarGoal) * 100],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)'],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                })

                $("#progress").append($("<button>").text("Clear Logged Nutrition Data").attr("class", "btn btn-primary p-2").click(() => {
                    fitDB.ref("/users/" + currentUserID + "/nutrition").set({
                        calories: 0,
                        protein: 0,
                        fat: 0,
                        carb: 0,
                        sugar: 0
                    })
                }))
            })
    } else {
        // No user is signed in.
        $(body).empty()
        $(body).html("No user signed in.  Please click 'Back' to return to the home page to sign in")
    }
})

$("#logout").click( () => {
    firebase.auth().signOut().then( () => {
        window.location.href = "home.html"
    })
})
