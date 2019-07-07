let working = true;
let timerOn = false;
let tick = null;

class Timer {
    constructor (minutes, display) {
    this.seconds = minutes * 60;
    this.startSeconds = minutes * 60;
    this.minutes = minutes;
    this.startMinutes = minutes;
    this.paused = true;
    }

    resume () {
        if (!this.paused) {
            this.seconds --;
            this.minutes = Math.floor(this.seconds /60);
            if (this.seconds%60 == 0) {
                this.minutes  = this.seconds/60;
            }
            updateTimerText(this.seconds, this.minutes)
        }
    }
    pause () {
        clearInterval(tick);
        this.paused = true;
    }
    stop () {
        this.pause();
        this.seconds = this.startSeconds;
        this.minutes = this.startMinutes;
        updateTimerText(this.startSeconds, this.startMinutes)
        updateStartTimeText();
    }
    updateStartTime (minutes) {
        this.startSeconds = minutes*60;
        this.seconds = minutes * 60;
        this.minutes = minutes;
        this.startMinutes = minutes;
    }
}


let workTimer = new Timer(25)
let breakTimer = new Timer(5)

let sessionTitle = document.querySelector('.session-title')
let arrowBtns = document.querySelectorAll('.up-arrow, .down-arrow');

arrowBtns = [...arrowBtns];




arrowBtns.forEach ( (btn)=>{
    btn.addEventListener('click', (e) => {
        if (!timerOn) {
            updateStartTime(e);
        }
    })
} )
function updateStartTimeText() {
    document.querySelector('.work-start-number').textContent = workTimer.startMinutes;
    document.querySelector('.break-start-number').textContent = breakTimer.startMinutes;
}
function updateStartTime (e) {
    let classes = e.target.className.split(' ');
    let currentStartTime = {}
    if (classes.includes('work')) {
        currentTimer = workTimer;
    } else {
        currentTimer = breakTimer;
    }
    if (classes.includes('up-arrow')) {
        if(!(currentTimer.minutes > 120)){
            currentTimer.updateStartTime(currentTimer.minutes + 1)
        }
    }
    else {
        if (currentTimer.minutes > 1) {
        currentTimer.updateStartTime(currentTimer.minutes - 1)
        }

    }
    updateStartTimeText();
    //Only update the work time because the times can only be changed at the start.
    updateTimerText(workTimer.seconds, workTimer.minutes)

}

let timer = document.querySelector('.timer');
let controls = document.querySelectorAll('.control-button img')
controls = [...controls]

controls.forEach((btn) => {

    btn.addEventListener('click', (e) => {
        btnId = e.target.id

        let currentTimer = {}
        if (working) {
            currentTimer = workTimer;
        }
        else {
            currentTimer = breakTimer;
        }
        switch(btnId) {
            case 'play':
            timerOn = true;
            if (currentTimer.paused) {

                tick = setInterval(() => {
                currentTimer.paused = false;

                currentTimer.resume()
                if(currentTimer != workTimer) {
                    // console.table(currentTimer)

                }

                if (working) {
                    sessionTitle.textContent = 'Time to Work!';
                }
                else {
                    sessionTitle.textContent ='Break!';
                }
                if (currentTimer.seconds <= 0) {
                    if (working) {
                        currentTimer = breakTimer;
                        [workTimer.minutes, workTimer.seconds] = [workTimer.startMinutes, workTimer.startSeconds];
                        working = false;
                    }
                    else {
                        currentTimer = workTimer;
                        [breakTimer.minutes, breakTimer.seconds] = [breakTimer.startMinutes, breakTimer.startSeconds];
                        working = true;
                    }
                }
            }, 1000);
            }


                break;

            case 'pause':
                if (!currentTimer.paused){
                    currentTimer.pause()
                }

                break;

            case 'stop':
                timerOn = false;
                currentTimer.stop();
                break;

            case 'reset':
                timerOn = false;
                currentTimer.pause();
                reset();
                break;
        }
    })
})

function reset () {
            workTimer.updateStartTime(25);
            breakTimer.updateStartTime(5);
            updateTimerText(25 * 60, 25)
            updateStartTimeText();
            sessionTitle = "session";
            working = true;
            clearInterval(tick);
            timerOn = false;
}

function updateTimerText (seconds, minutes) {
    let hoursText = '';
    let secondsText = '';
    let minutesText = '';


     if (seconds%60 < 10){
        secondsText = `0${seconds%60}`
    }
    else  {
            secondsText = seconds%60
        }

    if (minutes < 60) {
        if (minutes < 10) {
            minutesText = `0${minutes}`;
        }
        else {
            minutesText = minutes;
        }
    }
    else {
        hoursText = minutes/60
        if (minutes%60 < 10){
            minutesText = `0${minutes}`;
        }
        else {
            minutes = minutesText
        }
    }
    if (minutes < 60){
        timer.textContent = `${minutesText}:${secondsText}`
    }
    else {
        timer.textContent = `${hoursText}:${minutesText}:${secondsText}`
    }

}
