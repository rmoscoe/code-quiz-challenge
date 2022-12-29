//Use a class to construct question objects in order to avoid repeating all the inner HTML.

let idCounter = 0;
const mainSec = document.querySelector("main");
const welcome = document.getElementById("welcome");
const startButton = document.getElementById("start");
const saveScore = document.getElementById("save-score");
const initialsButton = document.getElementById("submit-initials");
const rawQuestions = ["Which of the following HTML tags runs JavaScript on a webpage?"];
const multiSelectQuestion = [false];
const rawCode = [""];
const rawAnswers = [[{text:"&ltlink&gt", dataCorrect:false}, {text:"&lta&gt", dataCorrect:false}, {text:"&ltscript&gt", dataCorrect:true}, {text:"&lthref&gt", dataCorrect:false}]];
const rawFeedback = ["The <script> tag runs JavaScript. The <link> tag links a CSS stylesheet, the <a> tag creates a hyperlink, and href is not a tag; it is an attribute of the <a> tag."]
let questions = [];
let multiSelect = false;
let secondsRemaining = 600;
let mins = 10;
let secs = 0;
let timer;
let currentQuestion;

//Each question object contains properties for the question and answer choices, as well as inner HTML that includes class attributes.
class Question {
    constructor(id, question, multiSelect, code, answers, feedback) {
        this.id = id;
        this.question = question;
        this.multiSelect = multiSelect;
        this.code = code;
        this.answers = answers;
        this.feedback = feedback;
        this.section = document.createElement("section");
        this.section.className = "question";
        this.section.innerHTML = "<h3>" + this.question + "</h3> <br /> <code>" + this.code + "</code><br /> <ul class = 'answers'><li class = 'answer-choice' data-correct = '" + this.answers[0].dataCorrect + "'>" + this.answers[0].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[1].dataCorrect + "'>" + this.answers[1].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[2].dataCorrect + "'>" + this.answers[2].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[3].dataCorrect + "'>" + this.answers[3].text + "</li></ul><br /> <button class = 'submit'>Submit</button>";

        idCounter++;
    }
}

startButton.addEventListener("click", startQuiz);
initialsButton.addEventListener("click", submitInitials);

//Use an array to store question objects. When the Start button is clicked and each time a question is submitted, use a random number to select another question from the array, then remove that question from the array.
function buildQuestionsArr() {
    for (let i = 0; i < rawQuestions.length; i++) {
        questions.push(new Question(idCounter, rawQuestions[i], multiSelectQuestion[i], rawCode[i], rawAnswers[i], rawFeedback[i]));
    }
}

function toggleSelected(event) {
    let clickedAnswer = event.target;
    if (clickedAnswer.classList.contains("selected")) {
        clickedAnswer.className = "answer-choice";
    } else {
        clickedAnswer.className = "answer-choice selected";
        if (!multiSelect) {
            let otherAnswer = clickedAnswer.parentNode.firstElementChild;
            while (otherAnswer) {
                if (otherAnswer != clickedAnswer) {
                    otherAnswer.className = "answer-choice";
                }
                otherAnswer = otherAnswer.nextElementSibling;
            }
        }
    }
}

function pickQuestion() {
    let prevQuestions = document.getElementsByClassName(".question");
    if (prevQuestions.length > 0) {
        for (element in prevQuestions) {
            element.style.display = "none";
        }
    }
    if (questions.length > 0) {
        let newQuestion = questions.splice(Math.floor(Math.random() * questions.length), 1)[0];
        currentQuestion = newQuestion;

        //Dynamically create and add elements using the stored properties of the question objects.
        mainSec.appendChild(newQuestion.section);
        let answerBoxes = document.querySelectorAll(".answer-choice");
        answerBoxes.forEach(answer => {
        answer.addEventListener("click", toggleSelected);
        })
        multiSelect = newQuestion.multiSelect;
        let submitButton = mainSec.lastElementChild.lastElementChild;
        submitButton.addEventListener("click", submitQuestion);
    } else {
        endQuiz();
    }
}

function submitQuestion() {
    let responseCorrect = false;

    //Select the last child of the mainSec. For each answer choice, if the choice is selected and correct or not selected and incorrect, change responseCorrect to true. If the choice is selected and incorrect or not selected and correct, change responseCorrect to false and break the loop. 
    const answerList = mainSec.lastElementChild.children[4];
    for (let i = 0; i < answerList.children.length; i++) {
        if ((answerList.children[i].matches(".selected") && answerList.children[i].getAttribute("data-correct") === "true") || (answerList.children[i].matches(".selected") == false && answerList.children[i].getAttribute("data-correct") === "false")) {
            responseCorrect = true;
        } else {
            responseCorrect = false;
            break;
        }
    }

    //Alert the response status, the feedback from the question object, and--if incorrect--that 20 seconds will be deducted. Deduct 20 seconds if applicable, then call pickQuestion.
    if (responseCorrect) {
        alert(`That's right! ${currentQuestion.feedback}`);
    } else {
        alert(`That's incorrect. ${currentQuestion.feedback} 20 seconds will be deducted from your remaining time.`);
        secondsRemaining -= 20;
    }   
    
    pickQuestion();
}

function startQuiz() {
    document.querySelector("aside").style.display = "none";
    document.getElementById("scores-link").textContent = "View Scores";
    welcome.style.display = "none";
    buildQuestionsArr();
    pickQuestion();
    timer = setInterval(countdown, 1000);
}

//For the timer, use minute and second variables. Update the display every second and calculate the variables based on a single time remaining variable that decrements every second.
function countdown() {
    if (secondsRemaining > 0) {
        secondsRemaining--;
        mins = Math.floor(secondsRemaining / 60);
        secs = String(secondsRemaining % 60).padStart(2, "0");
        document.getElementById("mins").textContent = mins;
        document.getElementById("secs").textContent = secs;
    } else {
        endQuiz();
    }
}

function endQuiz() {
    //Clear the timer, allow the user to save initials and score, and display scores.
    clearInterval(timer);
    mainSec.lastElementChild.style.display = "none";
    saveScore.style.display = "block";
    document.getElementById("final-score").textContent = secondsRemaining;
}

//For the scores, remember localStorage.setItem("Key", "Value") and localStorage.getItem("Key"). preventDefault() the Submit button for the initials associated with the score.
function submitInitials(event) {
    event.preventDefault();
    let initials = document.getElementById("initials").value.toUpperCase();
    const initialsStr = localStorage.getItem("initials");
    const quizScoresStr = localStorage.getItem("quizScores");
    let initialsArr = [];
    let quizScoresArr = [];
    if (initialsStr != null) {
        initialsArr = initialsStr.split(",");
        quizScoresArr = quizScoresStr.split(",");
    }
    let arrLength = initialsArr.push(initials);
    quizScoresArr.push(secondsRemaining);
    if (arrLength > 5) {
        let minScore = 600;
        for (i = 0; i < arrLength; i++) {
            if (quizScoresArr[i] < minScore) {
                minScore = quizScoresArr[i];
            }
        }
        let index = quizScoresArr.indexOf(minScore);
        initialsArr.splice(index, 1);
        quizScoresArr.splice(index, 1);
    }
    localStorage.setItem("initials", initialsArr.toString());
    localStorage.setItem("quizScores", quizScoresArr.toString());
    document.querySelector("aside").style.display = "block";
    document.getElementById("scores-link").textContent = "Hide Scores";
    saveScore.style.display = "none";
    welcome.style.display = "block";
}