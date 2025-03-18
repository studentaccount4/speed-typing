// banger tweets
const sentences = [
    "kinda sucks that the prize for washing your laundry is getting to fold your laundry",
    "now i understand why old people sit outside just to sit outside",
    "people who drive faster than me? reckless lunatics. people who drive slower than me? annoying cowards. and me? perfect, as per usual",
    "the best part about uni is when i reach a class comically late and then a guy shows up 15 minutes even later",
    "ending a sentence with two dots instead of three is my artistic preference because the thought is trailing off.. but not that far",
    "deleted hinge and started crushing on strangers at cafes like god intended",
    "they should invent 8 hours between 9pm and midnight"
];

// debug sentences
// const sentences = [
//     "the when how", "awesome sauce", "hello how are you"
// ]

let startTime, endTime, sentence, input, index = 0;
const inputElement = document.getElementById("input"),
      sentenceElement = document.getElementById("sentence"),
      resultsElement = document.getElementById("results"),
      resetElement = document.getElementById("reset"),
      catTypingElement = document.getElementById("cat_typing");

// on load
loadSentence();
inputElement.focus();

function updateTimer() {
    if (startTime) {
        updateText(false);
    }
}

function updateText(rating) {
    const timeTaken = now() - startTime,
          speed = calcSpeed(timeTaken);
    let html = `time: ${getTimeText(timeTaken)}s ~ ${speed} wpm`;
    if (rating) {
        const { rating, color } = getRating(speed);
        html += ` ... <span style="color: ${color}; font-weight: bold;">${rating}</span>`;
    }
    resultsElement.innerHTML = html;
}

function loadSentence() {
    // sentence = sentences[Math.floor(Math.random() * sentences.length)];
    sentence = sentences[index];
    sentenceElement.innerText = sentence;
    if (++index >= sentences.length) {
        index = 0; // reset to beginning
    }
}

function start() {
    startTime = now();
    setInterval(updateTimer, 100);
    catTypingElement.src = "cat_typing.gif";
}

function end(success) {
    if (success) {
        updateText(true);
    }
    startTime = null;
    endTime = now();
    catTypingElement.src = "cat_static.jpg";
}

function reset() {
    end(false); // if reset while typing, need this
    endTime = null; 
    loadSentence();
    inputElement.value = "";
    inputElement.focus();
    resultsElement.innerText = "start typing..";
}

function calcSpeed(timeTaken) {
    if (input) {
        // raw wpm = word count divided by time
        // const wordCount = input.split(" ").length;
        // return round((wordCount / timeTaken) * 1000 * 60, 1);
        // wpm = total number of characters divided by 5 and normalised to one minute
        const wordCount = input.length / 5;
        return round(wordCount / (timeTaken / (1000 * 60)), 1)
    }
    return 0;
}

function getRating(speed) {
    if (speed < 40) {
        return { rating: "🐢 bad", color: "rgb(220, 80, 80)" };
    } else if (speed < 80) {
        return { rating: "😐 meh", color: "rgb(230, 150, 60)" };
    } else if (speed < 120) {
        return { rating: "🙂 decent", color: "rgb(200, 180, 60)" };
    } else if (speed < 160) {
        return { rating: "🔥 great", color: "rgb(50, 170, 80)" };
    } else {
        return { rating: "🚀 insane", color: "rgb(120, 90, 200)" };
    }
}

function getTimeText(timeTaken) {
    return round(timeTaken / 1000, 1).toFixed(1); // force .0
}

function now() {
    return new Date().getTime();
}

function round(value, precision = 0) {
    if (precision === 0) return Math.round(value);
    let multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}

inputElement.addEventListener("keydown", function(event) {
    if (event.key == "Enter") { // reset game on enter
        event.preventDefault();
        reset();
        return;
    }
    // if game ended, prevent input
    if (endTime) {
        event.preventDefault();
        return;
    }
    // dont let windows control/mac command key start game
    if (!startTime && !event.cntrlKey && !event.metaKey) {
        start();
    }
});

inputElement.addEventListener("input", function() {
    input = this.value.trim();
    if (input === sentence) {
        end(true);
    }
});

inputElement.addEventListener("paste", function(event) {
    // prevent copy pasting input to cheat
    event.preventDefault();
    if (inputElement.value.length > 0) {
        inputElement.value += " ";
    }
    inputElement.value += "dont cheat!!";
});

resetElement.addEventListener("click", reset);
