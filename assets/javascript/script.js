//Use a class to construct question objects in order to avoid repeating all the inner HTML.

let idCounter = 0;
const mainSec = document.querySelector("main");
const welcome = document.getElementById("welcome");
const startButton = document.getElementById("start");
const rawQuestions = ["Which of the following tags runs JavaScript on a webpage?"];
const rawCode = [""];
const rawAnswers = [[{text:"&ltlink&gt", dataCorrect:"incorrect"}, {text:"&lta&gt", dataCorrect:"incorrect"}, {text:"&ltsrc&gt", dataCorrect:"correct"}, {text:"&lthref&gt", dataCorrect:"incorrect"}]];
let questions = [];

class Question {
    constructor(id, question, code, answers) {
        this.id = id;
        this.question = question;
        this.code = code;
        this.answers = answers;

        // if (prevId >= 0) {
        //     let prevSection = document.getElementById(prevQuestion);
        //     prevSection.style.display = "none";
        // }

        this.section = document.createElement("section");
        this.section.className = "question";
        this.section.innerHTML = "<h3>" + this.question + "</h3> <br /> <code>" + this.code + "</code><br /> <ul class = 'answers'><li class = 'answer-choice' data-correct = '" + this.answers[0].dataCorrect + "'>" + this.answers[0].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[1].dataCorrect + "'>" + this.answers[1].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[2].dataCorrect + "'>" + this.answers[2].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[3].dataCorrect + "'>" + this.answers[3].text + "</li></ul><br /> <button class = 'submit'>Submit</button>";

        idCounter++;
    }
}

startButton.addEventListener("click", startQuiz);

function buildQuestionsArr() {
    for (let i = 0; i < rawQuestions.length; i++) {
        questions.push(new Question(idCounter, rawQuestions[i], rawCode[i], rawAnswers[i]));
    }
}

function pickQuestion() {
    if (document.getElementsByClassName(".question").length > 0) {
        let prevQuestions = document.getElementsByClassName(".question");
        for (element in document.getElementsByClassName(".question")) {
            element.style.display = "none";
        }
    }
    mainSec.appendChild(questions[Math.floor(Math.random() * questions.length)].section);
}

function startQuiz() {
    welcome.style.display = "none";
    buildQuestionsArr();
    pickQuestion();
}

//Use an array to store question objects. When the Start button is clicked and each time a question is submitted, use a random number to select another question from the array, then remove that question from the array.
//Each question object contains properties for the question and answer choices, as well as inner HTML that includes class attributes.
//Dynamically create and add elements using the stored properties of the question objects.
//For the timer, use minute and second variables. Update the display every second and calculate the variables based on a single time remaining variable that decrements every second.
//For the scores, remember localStorage.setItem("Key", "Value") and localStorage.getItem("Key"). preventDefault() the Submit button for the initials associated with the score.