// getting elements

let timerElement = document.querySelector("#timerNumber");
const introSection = document.querySelector("#intro-section");
const questionsSection = document.querySelector("#questions-section");
const finalSection = document.querySelector("#final-section");
const scoresSection = document.querySelector("#scores-section");
let scoreListElement = document.querySelector("#score-list ul");

// Hiding starting elements for better UI
questionsSection.style.display = "none";
finalSection.style.display = "none";
scoresSection.style.display = "none";

// Array of questions
const questions = [
    "When did India play its First Test Match?",
    "How many times did India win the Cricket World Cup?",
    "Who won the ICC Champions Trophy in 2013?",
    "What is the name of the Award for Top Run Scorer in the ICC World Cup?",
    "Which Country hosted the most ICC World Cup Tournaments?"
];

// Array of answers 
const answers = [
    ["25 June 1932", "24 July 1928", "25 June 1928", "24 July 1932"],
    ["1", "2", "4", "5"],
    ["India", "Sri Lanka", "Pakistan", "Bangladesh"],
    [
        "Golden Cap Award",
        "Golden Hand Award",
        "Golden Bat Award",
        "Golden Ball Award"
    ],
    [
        "India",
        "Pakistan",
        "England",
        "United State America"
    ]

];

// Array of correct answer
const answer = [
    "0",
    "1",
    "0",
    "2",
    "2"
];

let questionCounter = 0;
let timerSeconds = 75;
let scoreList = [];
let quizStarted = false;

const startBtn = document.querySelector("#start");
const ansBtn = document.querySelectorAll("button.ansBtn")
const ans1Btn = document.querySelector("#firstanswer");
const ans2Btn = document.querySelector("#secondanswer");
const ans3Btn = document.querySelector("#thirdanswer");
const ans4Btn = document.querySelector("#forthanswer");
const submitScoreBtn = document.querySelector("#scoresubmit");
const goBackBtn = document.querySelector("#goback");
const clearScoreBtn = document.querySelector("#clearscores");
const viewScoreBtn = document.querySelector("#viewscores");

let redLabel = true;

// Creating timer for my quiz
function setTimer() {
    // 1000 miliseconds is 1 second so the interval will call each second
    let timerInterval = setInterval(function() {
        timerSeconds--;
        timerElement.textContent = `${timerSeconds}`;

        // Making the timer color red when time is under 30 seconds
        if (timerSeconds < 30) {
            document.querySelector("#currentTime").classList.add("text-danger")
        }
        if (timerSeconds === 0 || questionCounter === questions.length) {
            quizStarted = false;
            clearInterval(timerInterval);
            questionsSection.style.display = "none";
            finalSection.style.display = "block";
            viewScoreBtn.style.display = "block";
            let scoreElement = document.querySelector("#score");
            scoreElement.textContent = timerSeconds;
        }
    }, 1000);
}



// Chaning the question of user related to passed id
function setQuestion(id) {
    if (id < questions.length) {
        let questionElement = document.querySelector("#question");
        questionElement.textContent = questions[id];
        ans1Btn.textContent = answers[id][0];
        ans2Btn.textContent = answers[id][1];
        ans3Btn.textContent = answers[id][2];
        ans4Btn.textContent = answers[id][3];
    }
}


// Start button click listener
startBtn.addEventListener("click", function(event) {
    introSection.style.display = "none";
    viewScoreBtn.style.display = "none";
    scoresSection.style.display = "none";
    finalSection.style.display = "none";
    questionsSection.style.display = "block";
    questionCounter = 0;
    quizStarted = true;

    setTimer();
    setQuestion(questionCounter);

});

// Handeling the right or wrong answers which user submited
function answerHandler(event) {
    event.preventDefault();
    if (!quizStarted) {
        alert("No quizes started")
        return;
    }


    let AnswerResElement = document.querySelector("#answerShow");
    AnswerResElement.style.display = "block";
    let p = document.createElement("p");
    AnswerResElement.appendChild(p);

    // Showing this for 1 second
    setTimeout(function() {
        p.style.display = 'none';
    }, 1000);

    if (answer[questionCounter] === event.target.value) {
        p.textContent = "Correct!";
    } else if (answer[questionCounter] !== event.target.value) {
        timerSeconds = timerSeconds - 10;
        p.textContent = "Wrong!";
    }

    if (questionCounter < questions.length) {
        questionCounter++;
    }

    // Changing to next question after submit
    setQuestion(questionCounter);
}

// Adding Click listeners for all the multi choices
ans1Btn.addEventListener("click", answerHandler);
ans2Btn.addEventListener("click", answerHandler);
ans3Btn.addEventListener("click", answerHandler);
ans4Btn.addEventListener("click", answerHandler);

// Called when ever submit is clicked
submitScoreBtn.addEventListener("click", function(event) {

    event.preventDefault();

    let initialsInput = document.querySelector("#initials").value.toUpperCase();

    // Check if user input is empty
    if (!initialsInput) {
        alert("Please enter initial");
        return;
    }
    // Parsing the array to json for saving in local storage
    let storedScoreList = JSON.parse(localStorage.getItem("scoreList"));

    if (storedScoreList !== null) {
        scoreList = storedScoreList;
    }

    finalSection.style.display = "none";
    scoresSection.style.display = "block";


    // Adding new items for score list
    scoreList.push({ initials: initialsInput, score: timerSeconds });

    scoreList = scoreList.sort((a, b) => {
        if (a.score < b.score) {
            return 1;
        } else {
            return -1;
        }
    });

    // Updating displayed score list with new values
    scoreListElement.innerHTML = "";
    for (let i = 0; i < scoreList.length; i++) {
        let listColumn = document.createElement("div");
        listColumn.classList.add("col-3")
        listColumn.textContent = `${scoreList[i].initials}: ${scoreList[i].score}`;
        scoreListElement.append(listColumn);
    }

    // Saving the score list again
    localStorage.setItem("scoreList", JSON.stringify(scoreList));


});

goBackBtn.addEventListener("click", function() {
    scoresSection.style.display = "none";
    finalSection.style.display = "none";
    introSection.style.display = "block";
    timerSeconds = 75;
    timerElement.textContent = `${timerSeconds}`;
});

// Removes all data from local Storage
clearScoreBtn.addEventListener("click", function() {
    let storedScoreList = JSON.parse(localStorage.getItem("scoreList"));

    if (storedScoreList === null) {
        alert("Nothing to remove!");
    } else {
        localStorage.clear();
        scoreListElement.innerHTML = "";
        scoreList = [];
        alert("Cleared!");
    }

});

// This will load the localStorage and show the results in UI 
viewScoreBtn.addEventListener("click", function() {
    let storedScoreList = JSON.parse(localStorage.getItem("scoreList"));

    if (storedScoreList !== null) {
        scoreList = storedScoreList;
    }
    if (scoresSection.style.display === "none") {
        scoresSection.style.display = "block";
    } else if (scoresSection.style.display === "block") {
        scoresSection.style.display = "none";
        introSection.style.display = "block";
    } else {
        return alert("No scores to show.");
    }
});