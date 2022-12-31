//Use a class to construct question objects in order to avoid repeating all the inner HTML.

let idCounter = 0;
const mainSec = document.querySelector("main");
const welcome = document.getElementById("welcome");
const startButton = document.getElementById("start");
const saveScore = document.getElementById("save-score");
const initialsButton = document.getElementById("submit-initials");
const scoresLink = document.getElementById("scores-link");
const rawQuestions = ["Which of the following HTML tags runs JavaScript on a webpage?", "Which of the following punctuation marks should be added to the end of each statement?", "What does the following line of code do?", "Which of the following are primitive data types? Select all that apply.", "What is the correct syntax to add a single-line comment?", "Which of the following statements will increase the value of num by 1? Select all that apply.", "Which of the following statements will initialize a variable called 'myVar' with a Boolean value?", "Which of the following does the code snippet below represent?", "In the code snippet below, what is the scope of the variable 'myVar'?", "Which technique is used to create the function shown below?"];
const multiSelectQuestion = [false, false, false, true, false, true, false, false, false, false];
const rawCode = ["", "", "console.log('Hello world!');", "", "", "", "", "function(){\n\tconsole.log('I am a function.'\n}", "function doSomething(arr) {\n\tvar myVar = 0;\n\tfor (let i = 0; i < arr.length; i++) {\n\t\tmyVar +=10;\n\t\treturn myVar;\n\t}\n}", "function go() {\n\tconsole.log('Go!');\n}"];
const rawAnswers = [[{text:"&ltlink&gt", dataCorrect:false}, {text:"&lta&gt", dataCorrect:false}, {text:"&ltscript&gt", dataCorrect:true}, {text:"&lthref&gt", dataCorrect:false}],[{text:"Period (.)", dataCorrect:false}, {text:"Semicolon (;)", dataCorrect:true}, {text:"Colon (:)", dataCorrect:false}, {text:"Comma (,)", dataCorrect:false}], [{text:"It logs the text 'Hello world!' to the console.", dataCorrect:true}, {text:"It displays the text 'Hello world!' in the browser window.", dataCorrect:false}, {text:"It throws an error because it is not properly formatted.", dataCorrect:false}, {text:"It acts as a comment, which is ignored by the browser.", dataCorrect:false}], [{text:"String", dataCorrect:true}, {text:"Array", dataCorrect:false}, {text:"Number", dataCorrect:true}, {text:"Boolean", dataCorrect:true}], [{text:"**This is a comment**", dataCorrect:false}, {text:"&lt!--This is a comment--&gt", dataCorrect:false}, {text:"*/This is a comment/*", dataCorrect:false}, {text:"//This is a comment", dataCorrect:true}], [{text:"num = num + 1;", dataCorrect:true}, {text:"num += 1;", dataCorrect:true}, {text:"num++;", dataCorrect:true}, {text:"num === num + 1;", dataCorrect:false}], [{text:"const myVar = 10;", dataCorrect:false}, {text:"var myVar = 'true';", dataCorrect:false}, {text:"let myVar;", dataCorrect:false}, {text:"var myVar = false;", dataCorrect:true}], [{text:"Conditional statement", dataCorrect:false}, {text:"Loop", dataCorrect:false}, {text:"Function", dataCorrect:true}, {text:"Object", dataCorrect:false}], [{text:"Global", dataCorrect:false}, {text:"Local", dataCorrect:true}, {text:"Inner", dataCorrect:false}, {text:"Block", dataCorrect:false}], [{text:"Anonymous function", dataCorrect:false}, {text:"Arrow function", dataCorrect:false}, {text:"Function declaration", dataCorrect:true}, {text:"Function instantiation", dataCorrect:false}]];
const rawFeedback = ["The <script> tag runs JavaScript. The <link> tag links a CSS stylesheet, the <a> tag creates a hyperlink, and href is not a tag; it is an attribute of the <a> tag.", "Each statement should end with a semicolon (;).", "This statement logs the text 'Hello world!' to the console.", "Strings, numbers, and Booleans are primitive data types in JavaScript--and so are BigInts, undefined, null, and symbols.", "A single-line comment is preceded by two forward slashes (//This is a comment).", "The value of num can be increased by 1 with any of the following statements: num = num + 1; num += 1; num++;", "10 is a Number value, 'true' is a String value, and 'let myVar;' declares a variable without initializing it. 'var myVar = false;' initializes myVar with a Boolean value.", "This code snippet represents a function.", "The variable has local scope because it was declared within a function using the var keyword.", "This code is an example of a function declaration."]
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
        this.section.innerHTML = "<h3>" + this.question + "</h3> <div class='codeblock'><code>" + this.code + "</code></div><br /> <br /> <ul class = 'answers'><li class = 'answer-choice' data-correct = '" + this.answers[0].dataCorrect + "'>" + this.answers[0].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[1].dataCorrect + "'>" + this.answers[1].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[2].dataCorrect + "'>" + this.answers[2].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[3].dataCorrect + "'>" + this.answers[3].text + "</li></ul><br /> <button class = 'submit'>Submit</button>";

        idCounter++;
    }
}

startButton.addEventListener("click", startQuiz);
initialsButton.addEventListener("click", submitInitials);
scoresLink.addEventListener("click", toggleScores);

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
    let prevQuestion = mainSec.lastElementChild;
    prevQuestion.style.display = "none";
    if (questions.length > 0) {
        let randNum = Math.random();
        let newQuestion = questions.splice(Math.floor(randNum * questions.length), 1)[0];
        currentQuestion = newQuestion;

        //Dynamically create and add elements using the stored properties of the question objects.
        mainSec.appendChild(newQuestion.section);
        if (mainSec.lastElementChild.children[1].textContent === "") {
            mainSec.lastElementChild.children[1].style.display = "none";
            mainSec.lastElementChild.children[2].style.display = "none";
        }
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
    secondsRemaining = 600;
    document.querySelector("main").style.flex = "0 1 100%";
    document.querySelector("aside").style.display = "none";
    scoresLink.textContent = "View Scores";
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
    let initialsArr = getInitials();
    let quizScoresArr = getQuizScores();
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
    scoresLink.textContent = "Hide Scores";
    updateScores();
    if (window.matchMedia("min-width: 481px").matches) {
        document.querySelector("main").style.flex = "0 1 70%";
    }
    saveScore.style.display = "none";
    welcome.style.display = "block";
}

function toggleScores() {
    if (scoresLink.textContent === "Hide Scores") {
        document.querySelector("aside").style.display = "none";
        scoresLink.textContent = "View Scores";
        document.querySelector("main").style.flex = "0 1 100%";
    } else {
        document.querySelector("aside").style.display = "block";
        scoresLink.textContent = "Hide Scores";
        updateScores();
        if (window.matchMedia("min-width: 481px").matches) {
            document.querySelector("main").style.flex = "0 1 70%";
        }
    }
}

function getInitials() {
    const initialsStr = localStorage.getItem("initials");
    let initialsArr = [];
    if (initialsStr != null) {
        initialsArr = initialsStr.split(",");
    }
    return initialsArr;
}

function getQuizScores() {
    const quizScoresStr = localStorage.getItem("quizScores");
    let quizScoresArr = [];
    if (quizScoresStr != null) {
        quizScoresArr = quizScoresStr.split(",");
    }
    return quizScoresArr;
}

function updateScores() {
    const scoreList = document.getElementById("score-list");
    let existingScores = document.querySelectorAll(".score-row");
    for (let i = 0; i < existingScores.length; i++) {
        existingScores[i].remove();
    }
    let initialsArr = getInitials();
    let quizScoresArr = getQuizScores();
    for (let i = 0; i < initialsArr.length; i++) {
        let scoreRow = document.createElement("tr");
        scoreRow.id = "score-row-" + i;
        scoreRow.className = "score-row";
        scoreList.appendChild(scoreRow);
        let initials = document.createElement("td");
        initials.id = "score-row-" + i + "-initials";
        initials.className = "initials";
        let row = document.getElementById("score-row-" + i);
        row.appendChild(initials);
        initials.textContent = initialsArr[i];
        let score = document.createElement("td");
        score.id = "score-row-" + i + "-score";
        score.className = "score";
        row.appendChild(score);
        score.textContent = quizScoresArr[i];
    }
}