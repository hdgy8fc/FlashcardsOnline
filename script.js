let score = 0;
let remaining = 100;
let currentProblem = {};
let problemElement = document.getElementById("problem");
let answerInput = document.getElementById("answer");
let scoreElement = document.getElementById("score");
let remainingElement = document.getElementById("remaining");
let timeout;
let minNum = 1;
let maxNum = 10; 

// Initial gamemode selection message
problemElement.textContent = "Choose a gamemode: H for Hard, M for Medium, E for Easy";

// Gamemode selection
answerInput.addEventListener("keypress", function (event) {
    if (!currentProblem.num1) { // Only run this before the game starts
        if (event.key === "Enter") {
            let mode = answerInput.value.trim().toUpperCase();
            if (mode === "H") {
                minNum = 1;
                maxNum = 200;
                startGame();
            } else if (mode === "M") {
                minNum = 1;
                maxNum = 20;
                startGame();
            } else if (mode === "E") {
                minNum = 1;
                maxNum = 10;
                startGame();
            } else {
                problemElement.textContent = "Invalid input. Choose: H for Hard, M for Medium, E for Easy";
            }
            answerInput.value = "";
        }
    }
});

function startGame() {
    generateProblem();
}

function generateProblem() {
    let num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    let num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    let operators = ["+", "-", "x", "/"];
    let operator = operators[Math.floor(Math.random() * operators.length)];

    if (operator === "/") {
        num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum; // Ensure num2 is not zero
        num1 = num2 * (Math.floor(Math.random() * (maxNum / num2)) + 1); // Make num1 a multiple of num2
    } else if (operator === "-") {
        if (num2 > num1) {
            [num1, num2] = [num2, num1]; // Swap values to avoid negative answers
        }
    }

    let evalOperator = operator === "x" ? "*" : operator;
    currentProblem = { num1, num2, operator, answer: eval(num1 + evalOperator + num2) };
    problemElement.textContent = `${num1} ${operator} ${num2}`;
    resetTimeout();
}




let cheatMode = false;

let correctSound = new Audio("sounds/correct.mp3");
let wrongSound = new Audio("sounds/wrong.mp3")
let alarmSound = new Audio("sounds/cheat.mp3")
function checkAnswer() {
    let userAnswer = answerInput.value.trim();
    if (userAnswer === "") return; // Prevent blank submissions
    clearTimeout(timeout); // Reset timeout if answered

    if (userAnswer === "22625") {
        cheatMode = true;
        problemElement.textContent = "Cheat mode activated! You can't get anything wrong now.";
        setTimeout(() => updateScoreAndNext(), 1000);
        alarmSound.play();
        return;
    }

    userAnswer = parseFloat(userAnswer);

    if (cheatMode || (!isNaN(userAnswer) && userAnswer === currentProblem.answer)) {
        score++;
        updateScoreAndNext();
        correctSound.play();
    } else {
        problemElement.textContent = `Wrong, the answer is ${currentProblem.answer}`;
        setTimeout(() => updateScoreAndNext(), 1000);
        wrongSound.play();
    }
    remaining--;
}


function updateScoreAndNext() {
    scoreElement.textContent = `Score: ${score}`;
    remainingElement.textContent = `Remaining: ${remaining}`;
    answerInput.value = "";

    if (remaining > 0) {
        generateProblem();
    } else {
        if (cheatMode)
            problemElement.textContent = "Wow you got " + score + " in cheat mode, that was unexpected."
        else if (score === 0)
            problemElement.textContent = "Oof... a perfect zero. Maybe actually try next time? ;(";
        else if (score < 20)
            problemElement.textContent = "Try harder! You got " + score + ". Maybe practice a bit more.";
        else if (score < 50)
            problemElement.textContent = "You're doing good, but a little more practice could help! Your score: " + score;
        else if (score < 70)
            problemElement.textContent = "You're doing amazing, but I know you can do even better! Your score: " + score;
        else if (score < 100)
            problemElement.textContent = "Incredible work! You scored " + score + "!";
        answerInput.disabled = true;
    }
}

function resetTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        remaining--;
        problemElement.textContent = `You took too long, the answer is ${currentProblem.answer}`;
        answerInput.value = "";
        setTimeout(() => {
            updateScoreAndNext();
        }, 1000);
    }, 8000); // 8 seconds timer
}

// Allow Enter key to submit answer
answerInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && currentProblem.num1) { // Only allow answering after game starts
        checkAnswer();
    }
});
