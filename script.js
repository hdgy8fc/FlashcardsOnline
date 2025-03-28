let score = 0;
let remaining = 100;
let currentProblem = {};
let problemElement = document.getElementById("problem");
let answerInput = document.getElementById("answer");
let scoreElement = document.getElementById("score");
let remainingElement = document.getElementById("remaining");
let timeout;
let minNum = 1;
let maxNum = 10; // Default is easy mode

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
                problemElement.textContent = "Invalid input. Choose H for Hard, M for Medium, E for Easy";
            }
            answerInput.value = "";
        }
    }
});

answerInput.addEventListener("input", function () {
    if (answerInput.value.trim().toLowerCase() === "hawk tuah") {
        document.body.classList.add("pink-mode");
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

    if (userAnswer.toLowerCase() === "hawk tuah") {
        document.body.classList.add("pink-mode");
        return;
    }

    if (userAnswer === "!%debug%!") {
        cheatMode = true;
        problemElement.textContent = "Debug mode activated! This is mainly used for testing!.";
        setTimeout(() => updateScoreAndNext(), 10000);
        alarmSound.play();
        

        // Change font styles to default (remove Comic Sans)
        document.querySelectorAll("*").forEach(el => {
            el.style.fontFamily = "initial";
        });

        // Change background image
        document.body.style.backgroundImage = "url('https://i.postimg.cc/tJHy1RdZ/Class-Starts-Now-Copy.jpg')"; // Change to your new image

        // Change .container image
        document.querySelector(".container").style.backgroundImage = "url('https://i.postimg.cc/ydsvWwg6/sigma-Copy.png')"; // Change to your new image

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
            problemElement.textContent = "DEBUG TEST SCORE: " + score + " TEST " + Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum + " IS DONE";
        else if (score === 0)
            problemElement.textContent = "Oof... a perfect zero. Maybe actually try next time? ;(";
        else if (score < 20)
            problemElement.textContent = "Try harder! You got " + score + ". Maybe practice a bit more.";
        else if (score < 50)
            problemElement.textContent = "You're doing good, but a little more practice could help! Your score: " + score;
        else if (score < 70)
            problemElement.textContent = "You're doing amazing, but I know you can do even better! Your score: " + score;
        else if (score < 99)
            problemElement.textContent = "Incredible work! You scored " + score + "!";
        else if (score = 100)
            problemElement.textContent = "Amazing work! you got a " + score
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
