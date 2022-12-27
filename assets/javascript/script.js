//Use a class to construct question objects in order to avoid repeating all the inner HTML.

let idCounter = 0;
const mainSec = document.querySelector("main");
const welcome = document.getElementById("welcome");
const startButton = document.getElementById("start");
const rawQuestions = ["Which of the following tags runs JavaScript on a webpage?"];
const multiSelectQuestion = [false];
const rawCode = [""];
const rawAnswers = [[{text:"&ltlink&gt", dataCorrect:"incorrect"}, {text:"&lta&gt", dataCorrect:"incorrect"}, {text:"&ltsrc&gt", dataCorrect:"correct"}, {text:"&lthref&gt", dataCorrect:"incorrect"}]];
let questions = [];
let multiSelect = false;

class Question {
    constructor(id, question, multiSelect, code, answers) {
        this.id = id;
        this.question = question;
        this.multiSelect = multiSelect;
        this.code = code;
        this.answers = answers;
        this.section = document.createElement("section");
        this.section.className = "question";
        this.section.innerHTML = "<h3>" + this.question + "</h3> <br /> <code>" + this.code + "</code><br /> <ul class = 'answers'><li class = 'answer-choice' data-correct = '" + this.answers[0].dataCorrect + "'>" + this.answers[0].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[1].dataCorrect + "'>" + this.answers[1].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[2].dataCorrect + "'>" + this.answers[2].text + "</li><li class = 'answer-choice' data-correct = '" + this.answers[3].dataCorrect + "'>" + this.answers[3].text + "</li></ul><br /> <button class = 'submit'>Submit</button>";

        idCounter++;
    }
}

startButton.addEventListener("click", startQuiz);

function buildQuestionsArr() {
    for (let i = 0; i < rawQuestions.length; i++) {
        questions.push(new Question(idCounter, rawQuestions[i], multiSelectQuestion[i], rawCode[i], rawAnswers[i]));
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
    if (document.getElementsByClassName(".question").length > 0) {
        let prevQuestions = document.getElementsByClassName(".question");
        for (element in prevQuestions) {
            element.style.display = "none";
        }
    }
    let newQuestion = questions[Math.floor(Math.random() * questions.length)]
    mainSec.appendChild(newQuestion.section);
    let answerBoxes = document.querySelectorAll(".answer-choice");
    answerBoxes.forEach(answer => {
        answer.addEventListener("click", toggleSelected);
    })
    multiSelect = newQuestion.multiSelect;
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