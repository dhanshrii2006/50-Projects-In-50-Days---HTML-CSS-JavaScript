// DOM Elements
const hourEl = document.getElementById('hourHand');
const minuteEl = document.getElementById('minuteHand');
const secondEl = document.getElementById('secondHand');
const digitalTimeEl = document.getElementById('digitalTime');
const digitalDateEl = document.getElementById('digitalDate');
const timezoneInfoEl = document.getElementById('timezoneInfo');

// Control Elements
const toggleThemeBtn = document.getElementById('toggleTheme');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const soundToggleBtn = document.getElementById('soundToggle');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettings');

// Settings Elements
const timezoneSelect = document.getElementById('timezoneSelect');
const clockThemeSelect = document.getElementById('clockTheme');
const animationSpeedSlider = document.getElementById('animationSpeed');
const speedValueSpan = document.getElementById('speedValue');

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Stopwatch Elements
const stopwatchTimeEl = document.getElementById('stopwatchTime');
const stopwatchMsEl = document.getElementById('stopwatchMs');
const stopwatchStartBtn = document.getElementById('stopwatchStart');
const stopwatchPauseBtn = document.getElementById('stopwatchPause');
const stopwatchResetBtn = document.getElementById('stopwatchReset');
const stopwatchLapBtn = document.getElementById('stopwatchLap');
const lapTimesEl = document.getElementById('lapTimes');

// Timer Elements
const timerSetupEl = document.getElementById('timerSetup');
const timerDisplayEl = document.getElementById('timerDisplay');
const timerHoursInput = document.getElementById('timerHours');
const timerMinutesInput = document.getElementById('timerMinutes');
const timerSecondsInput = document.getElementById('timerSeconds');
const timerStartBtn = document.getElementById('timerStart');
const timerPauseBtn = document.getElementById('timerPause');
const timerStopBtn = document.getElementById('timerStop');
const timerTimeEl = document.getElementById('timerTime');

// Alarm Elements
const alarmHourInput = document.getElementById('alarmHour');
const alarmMinuteInput = document.getElementById('alarmMinute');
const alarmAmPmSelect = document.getElementById('alarmAmPm');
const alarmSetBtn = document.getElementById('alarmSet');
const alarmListEl = document.getElementById('alarmList');
const alarmModal = document.getElementById('alarmModal');
const alarmModalTimeEl = document.getElementById('alarmModalTime');
const dismissAlarmBtn = document.getElementById('dismissAlarm');
const dayBtns = document.querySelectorAll('.day-btn');

// Audio Elements
const alarmSound = document.getElementById('alarmSound');
const tickSound = document.getElementById('tickSound');

// Global Variables
let currentTimezone = 'local';
let isDarkMode = false;
let isSoundEnabled = true;
let animationSpeed = 1;
let stopwatchInterval;
let stopwatchRunning = false;
let stopwatchTime = 0;
let timerInterval;
let timerRunning = false;
let timerTotalTime = 0;
let timerCurrentTime = 0;
let activeAlarms = [];
let lapCount = 0;

// Constants
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Utility Functions
const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

const formatTime = (hours, minutes, seconds = null) => {
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    if (seconds !== null) {
        const s = seconds.toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
    return `${h}:${m}`;
};

const playSound = (sound) => {
    if (isSoundEnabled && sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play failed:', e));
    }
};

// Theme Management
toggleThemeBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    const icon = toggleThemeBtn.querySelector('i');
    const text = toggleThemeBtn.querySelector('span');
    
    if (isDarkMode) {
        icon.className = 'fas fa-sun';
        text.textContent = 'Light Mode';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Dark Mode';
    }
});

// Fullscreen Management
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(e => {
            console.log('Fullscreen failed:', e);
        });
    } else {
        document.exitFullscreen();
    }
});

// Sound Toggle
soundToggleBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    const icon = soundToggleBtn.querySelector('i');
    icon.className = isSoundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
});

// Settings Panel
settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.add('hidden');
});

// Settings Event Listeners
timezoneSelect.addEventListener('change', (e) => {
    currentTimezone = e.target.value;
    updateTimezoneInfo();
});

clockThemeSelect.addEventListener('change', (e) => {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${e.target.value}`);
});

animationSpeedSlider.addEventListener('input', (e) => {
    animationSpeed = parseFloat(e.target.value);
    speedValueSpan.textContent = `${animationSpeed}x`;
});

// Tab Management
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Clock Functions
function getCurrentTime() {
    const now = new Date();
    
    if (currentTimezone === 'local') {
        return now;
    } else if (currentTimezone === 'UTC') {
        return new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    } else {
        return new Date(now.toLocaleString("en-US", {timeZone: currentTimezone}));
    }
}

function updateTimezoneInfo() {
    if (currentTimezone === 'local') {
        timezoneInfoEl.textContent = 'Local Time';
    } else {
        timezoneInfoEl.textContent = currentTimezone.replace('_', ' ');
    }
}

function setTime() {
    const time = getCurrentTime();
    const month = time.getMonth();
    const day = time.getDay();
    const date = time.getDate();
    const hours = time.getHours();
    const hoursForClock = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Update analog clock hands
    if (hourEl && minuteEl && secondEl) {
        const hourDegrees = scale(hoursForClock % 12 + minutes / 60, 0, 12, 0, 360);
        const minuteDegrees = scale(minutes, 0, 60, 0, 360);
        const secondDegrees = scale(seconds, 0, 60, 0, 360);
        
        hourEl.style.transform = `translate(-50%, -100%) rotate(${hourDegrees}deg)`;
        minuteEl.style.transform = `translate(-50%, -100%) rotate(${minuteDegrees}deg)`;
        secondEl.style.transform = `translate(-50%, -100%) rotate(${secondDegrees}deg)`;
        
        // Apply animation speed
        hourEl.style.transition = `transform ${1/animationSpeed}s ease`;
        minuteEl.style.transition = `transform ${1/animationSpeed}s ease`;
        secondEl.style.transition = `transform ${0.1/animationSpeed}s ease`;
    }

    // Update digital display
    if (digitalTimeEl) {
        digitalTimeEl.textContent = `${hoursForClock}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    
    if (digitalDateEl) {
        digitalDateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`;
    }
    
    // Check alarms
    checkAlarms(hours, minutes);
}

// Stopwatch Functions
function updateStopwatchDisplay() {
    const totalSeconds = Math.floor(stopwatchTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = stopwatchTime % 1000;
    
    stopwatchTimeEl.textContent = formatTime(hours, minutes, seconds);
    stopwatchMsEl.textContent = milliseconds.toString().padStart(3, '0');
}

stopwatchStartBtn.addEventListener('click', () => {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        const startTime = Date.now() - stopwatchTime;
        
        stopwatchInterval = setInterval(() => {
            stopwatchTime = Date.now() - startTime;
            updateStopwatchDisplay();
        }, 10);
    }
});

stopwatchPauseBtn.addEventListener('click', () => {
    if (stopwatchRunning) {
        stopwatchRunning = false;
        clearInterval(stopwatchInterval);
    }
});

stopwatchResetBtn.addEventListener('click', () => {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    lapCount = 0;
    updateStopwatchDisplay();
    lapTimesEl.innerHTML = '';
});

stopwatchLapBtn.addEventListener('click', () => {
    if (stopwatchRunning) {
        lapCount++;
        const lapTime = stopwatchTime;
        const totalSeconds = Math.floor(lapTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = lapTime % 1000;
        
        const lapDiv = document.createElement('div');
        lapDiv.className = 'lap-time';
        lapDiv.innerHTML = `Lap ${lapCount}: ${formatTime(hours, minutes, seconds)}.${milliseconds.toString().padStart(3, '0')}`;
        lapTimesEl.appendChild(lapDiv);
    }
});

// Timer Functions
function updateTimerDisplay() {
    const hours = Math.floor(timerCurrentTime / 3600);
    const minutes = Math.floor((timerCurrentTime % 3600) / 60);
    const seconds = timerCurrentTime % 60;
    
    timerTimeEl.textContent = formatTime(hours, minutes, seconds);
    
    // Update progress ring
    const progressRing = document.querySelector('.progress-ring-circle');
    if (progressRing && timerTotalTime > 0) {
        const progress = (timerTotalTime - timerCurrentTime) / timerTotalTime;
        const circumference = 2 * Math.PI * 90;
        const offset = circumference * (1 - progress);
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = offset;
    }
}

timerStartBtn.addEventListener('click', () => {
    const hours = parseInt(timerHoursInput.value) || 0;
    const minutes = parseInt(timerMinutesInput.value) || 0;
    const seconds = parseInt(timerSecondsInput.value) || 0;
    
    timerTotalTime = hours * 3600 + minutes * 60 + seconds;
    timerCurrentTime = timerTotalTime;
    
    if (timerTotalTime > 0) {
        timerSetupEl.classList.add('hidden');
        timerDisplayEl.classList.remove('hidden');
        
        timerRunning = true;
        timerInterval = setInterval(() => {
            timerCurrentTime--;
            updateTimerDisplay();
            
            if (timerCurrentTime <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                playSound(alarmSound);
                alert('Timer finished!');
                timerStopBtn.click();
            }
        }, 1000);
    }
});

timerPauseBtn.addEventListener('click', () => {
    if (timerRunning) {
        timerRunning = false;
        clearInterval(timerInterval);
    } else {
        timerRunning = true;
        timerInterval = setInterval(() => {
            timerCurrentTime--;
            updateTimerDisplay();
            
            if (timerCurrentTime <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                playSound(alarmSound);
                alert('Timer finished!');
                timerStopBtn.click();
            }
        }, 1000);
    }
});

timerStopBtn.addEventListener('click', () => {
    timerRunning = false;
    clearInterval(timerInterval);
    timerDisplayEl.classList.add('hidden');
    timerSetupEl.classList.remove('hidden');
});

// Alarm Functions
dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
});

alarmSetBtn.addEventListener('click', () => {
    const hour = parseInt(alarmHourInput.value);
    const minute = parseInt(alarmMinuteInput.value);
    const ampm = alarmAmPmSelect.value;
    const selectedDays = Array.from(dayBtns)
        .filter(btn => btn.classList.contains('active'))
        .map(btn => parseInt(btn.dataset.day));
    
    const alarm = {
        id: Date.now(),
        hour: hour,
        minute: minute,
        ampm: ampm,
        days: selectedDays,
        active: true
    };
    
    activeAlarms.push(alarm);
    renderAlarms();
    
    // Reset form
    dayBtns.forEach(btn => btn.classList.remove('active'));
});

function renderAlarms() {
    alarmListEl.innerHTML = '';
    
    activeAlarms.forEach(alarm => {
        const alarmDiv = document.createElement('div');
        alarmDiv.className = 'alarm-item';
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const daysText = alarm.days.length === 0 ? 'Once' : 
                        alarm.days.map(d => dayNames[d]).join(', ');
        
        alarmDiv.innerHTML = `
            <div class="alarm-info">
                <div class="alarm-time-display">${alarm.hour}:${alarm.minute.toString().padStart(2, '0')} ${alarm.ampm}</div>
                <div class="alarm-days-display">${daysText}</div>
            </div>
            <button class="delete-alarm" onclick="deleteAlarm(${alarm.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        alarmListEl.appendChild(alarmDiv);
    });
}

function deleteAlarm(id) {
    activeAlarms = activeAlarms.filter(alarm => alarm.id !== id);
    renderAlarms();
}

function checkAlarms(currentHour, currentMinute) {
    const currentDay = new Date().getDay();
    
    activeAlarms.forEach(alarm => {
        let alarmHour = alarm.hour;
        if (alarm.ampm === 'PM' && alarm.hour !== 12) {
            alarmHour += 12;
        } else if (alarm.ampm === 'AM' && alarm.hour === 12) {
            alarmHour = 0;
        }
        
        if (alarmHour === currentHour && alarm.minute === currentMinute) {
            if (alarm.days.length === 0 || alarm.days.includes(currentDay)) {
                triggerAlarm(alarm);
            }
        }
    });
}

function triggerAlarm(alarm) {
    alarmModalTimeEl.textContent = `${alarm.hour}:${alarm.minute.toString().padStart(2, '0')} ${alarm.ampm}`;
    alarmModal.classList.remove('hidden');
    playSound(alarmSound);
}

dismissAlarmBtn.addEventListener('click', () => {
    alarmModal.classList.add('hidden');
    alarmSound.pause();
    alarmSound.currentTime = 0;
});

// Generate minute markers
function generateMinuteMarkers() {
    const minuteMarkersContainer = document.querySelector('.minute-markers');
    if (minuteMarkersContainer) {
        for (let i = 0; i < 60; i++) {
            if (i % 5 !== 0) { // Skip hour markers
                const marker = document.createElement('div');
                marker.className = 'minute-marker';
                marker.style.transform = `rotate(${i * 6}deg)`;
                minuteMarkersContainer.appendChild(marker);
            }
        }
    }
}

// Make deleteAlarm globally accessible
window.deleteAlarm = deleteAlarm;

// Initialize
generateMinuteMarkers();
setTime();
updateStopwatchDisplay();

// Start the clock
setInterval(setTime, 1000);