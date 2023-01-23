var speechTimeout;
var timerEnabled = true;

function startTimer(duration, display, callback) { //duration in seconds
    var timer = duration, minutes, seconds;
    function tickDown() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerText = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timeInterval);
            if(callback) callback();
        }
    }
    tickDown();
    var timeInterval = setInterval(function () {
        tickDown();
    }, 1000);
}

function setTimerEnabled() {
    if(document.getElementById("hidetimer").checked) {
        timerEnabled = false;
    } else {
        timerEnabled = true;
    }
}

function toggleTimer() {
    if(!timerEnabled) {
        let toHide = document.getElementsByClassName("timer");
        for(let i=0; i<toHide.length; i++) {
            toHide[i].style.display = "none";
        }

        let toShow = document.getElementsByClassName("timer-alt");
        for(let i=0; i<toShow.length; i++) {
            toShow[i].style.display = "block";
        }
    } else {
        let toHide = document.getElementsByClassName("timer-alt");
        for(let i=0; i<toHide.length; i++) {
            toHide[i].style.display = "none";
        }

        let toShow = document.getElementsByClassName("timer");
        for(let i=0; i<toShow.length; i++) {
            toShow[i].style.display = "block";
        }
    }
}

function initPreparedSpeech() {
    document.getElementById("main").innerHTML = `
    Get ready to start in <B><SPAN ID="timer2" CLASS="timer">0:05</SPAN></B> seconds.`
    startTimer(5, document.getElementById("timer2"), startPreparedSpeech)
}

function startPreparedSpeech() {
    document.getElementById("main").style.textAlign = "center";
    document.getElementById("main").innerHTML = `
    <SPAN ID="timer3" CLASS="timer-large timer">4:00</SPAN>
    <SPAN ID="timeleft" CLASS="timer-alt">4 minutes left</SPAN>
    <BR>
    <BUTTON CLASS="main-button" ONCLICK="finishPreparedSpeech()">Finish speech</BUTTON>
    `
    toggleTimer();
    startTimer(240, document.getElementById("timer3"));
    document.body.style.backgroundColor = "var(--green)";
    speechTimeout = setTimeout(function() {
        document.body.style.backgroundColor = "var(--light-blue)";
        document.getElementById("timeleft").innerText = "1 minute left";

        speechTimeout = setTimeout(function() {
            document.body.style.backgroundColor = "#d8cd00";
            document.getElementById("timeleft").innerText = "30 seconds left";

            speechTimeout = setTimeout(function() {
                document.body.style.backgroundColor = "red";
                document.getElementById("timeleft").innerText = "Time's up! STOP.";
            }, 30000);
        }, 30000);
    }, 180000);
}

function finishPreparedSpeech() {
    let time = document.getElementById("timer3").innerText;
    time = time.split(":");
    let minutesSpent = 3-Number(time[0]);
    let secondsSpent = 60-Number(time[1]);
    if(secondsSpent == 60) {
        minutesSpent++;
        secondsSpent = 0;
    }
    let totalTime = 240 - (Number(time[0])*60+Number(time[1]));

    clearTimeout(speechTimeout);
    document.body.style.backgroundColor = "var(--dark)";
    document.getElementById("main").style.textAlign = "left";
    document.getElementById("main").innerHTML = `
    Your prepared speech lasted ${minutesSpent} minutes and ${secondsSpent} seconds. You have ${document.getElementById("timer3").innerText} left over. <SPAN ID="append-note"></SPAN>
    <BR><BUTTON CLASS="main-button" ONCLICK="homePage()" STYLE="margin-top: 15px">Back to home page</BUTTON>
    `
    if(totalTime == 240) {
        document.getElementById("append-note").innerText = "Watch out! Don't go over time (3.5 to 4 minutes)!";
    } else if(totalTime < 210) {
        document.getElementById("append-note").innerText = "Warning: you did not make time (3.5 to 4 minutes).";
    } else {
        document.getElementById("append-note").innerText = "Congrats, you made time (3.5 to 4 minutes).";
    }
}

function homePage() {
    let checked = ""
    if(!timerEnabled) {
        checked = " checked";
    }
    document.getElementById("main").innerHTML = `
    <DIV CLASS="main-header">AcaDec Prepared Speech Practice</DIV>
    <DIV CLASS="main-text">Click the button below to start your prepared speech practice. You will have 3.5 to 4 minutes to give your speech. Signals will be given at the 1, 0.5, and 0 minutes remaining marks. <DIV STYLE="height: 10px;"></DIV>If you check "hide timer", you'll only see the color-coded timecards without a timer. Color codes are:
    <SPAN STYLE="background-color: var(--green); color: var(--light)">4 minutes left</SPAN>, <SPAN STYLE="background-color: var(--light-blue); color: var(--light)">1 minute left</SPAN>, <SPAN STYLE="background-color: #d8cd00; color: var(--dark)">30 seconds left</SPAN>, and <SPAN STYLE="background-color: red; color: var(--light)">time's up</SPAN>. When you're finished speaking, hit the "finish speech" button for your timing result.</DIV>
    <BUTTON CLASS="main-button" STYLE="margin-top: 20px;" ONCLICK="startPreparedSpeech()">Click to begin</BUTTON>
    <LABEL CLASS="timertoggle">
        <input type="checkbox" id="hidetimer" name="hidetimer" ONCLICK="setTimerEnabled()"${checked}>
        <span class="slider"></span>
    </LABEL>
    <SPAN STYLE="font-size: 16px; vertical-align: middle;">Hide Timer</SPAN>
    <A STYLE="display: block; margin-top: 15px;" HREF="index.html">< Back to home</A>
    `;
}
