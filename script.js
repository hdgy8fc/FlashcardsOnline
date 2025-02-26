let score = 0;
let remaining = 100;
let currentProblem = {};
let problemElement = document.getElementById("problem");
let answerInput = document.getElementById("answer");
let scoreElement = document.getElementById("score");
let remainingElement = document.getElementById("remaining");
let timeout;

function generateProblem() {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let operators = ["+", "-", "x", "/"];
    let operator = operators[Math.floor(Math.random() * operators.length)];

    if (operator === "/") {
        num1 = num1 * num2;
    }

    let evalOperator = operator === "x" ? "*" : operator;
    currentProblem = { num1, num2, operator, answer: eval(num1 + evalOperator + num2) };
    problemElement.textContent = `${num1} ${operator} ${num2}`;
    resetTimeout();
}

function checkAnswer() {
    let userAnswer = answerInput.value.trim();
    if (userAnswer === "") return; // Prevent blank submissions
    clearTimeout(timeout); // Reset timeout if answered
    userAnswer = parseFloat(userAnswer);
    if (!isNaN(userAnswer) && userAnswer === currentProblem.answer) {
        score++;
    }
    remaining--;
    updateScoreAndNext();
}

function updateScoreAndNext() {
    scoreElement.textContent = `Score: ${score}`;
    remainingElement.textContent = `Remaining: ${remaining}`;
    answerInput.value = "";

    if (remaining > 0) {
        generateProblem();
    } else {
        problemElement.textContent = "Game Over! Final Score: " + score;
        answerInput.disabled = true;
    }
}

function resetTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        remaining--;
        problemElement.textContent = "Took too long, Next question";
        answerInput.value = "";
        setTimeout(() => {
            updateScoreAndNext();
        }, 1000);
    }, 5000);
}

// Allow Enter key to submit answer
answerInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

// Start the first problem
generateProblem();
