"use strict";
/* =====================================================
ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ВАЛИДАЦИИ
===================================================== */
function validateNumberInput(value) {
  if (value.trim() === "") {
    return "Ошибка: поле не должно быть пустым";
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return "Ошибка: введите число";
  }
  if (!Number.isFinite(num)) {
    return "Ошибка: значение не может быть Infinity";
  }
  if (num === 0) {
    return "Ошибка: значение не может быть 0";
  }
  if (num < 0) {
    return "Ошибка: число не может быть отрицательным";
  }
  return null;
}

function formatHHMMSS(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatMMSS(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* =====================================================
1 СЕКУНДОМЕР
===================================================== */
const swDisplay = document.getElementById("stopwatch-display");
const swStart = document.getElementById("sw-start");
const swStop = document.getElementById("sw-stop");
const swReset = document.getElementById("sw-reset");

let swSeconds = 0;
let swInterval = null;

function updateStopwatch() {
  swDisplay.textContent = formatHHMMSS(swSeconds);
}

function startStopwatch() {
  if (swInterval !== null) return;

  // Использую setInterval, потому что нужно увеличивать время каждую секунду многократно
  // setInterval выполняет функцию через равные промежутки времени (1000 мс)
  swInterval = setInterval(() => {
    swSeconds++;
    updateStopwatch();
    localStorage.setItem("stopwatchSeconds", swSeconds);
  }, 1000);
}

function stopStopwatch() {
  if (swInterval !== null) {
    // Использую clearInterval, потому что нужно остановить повторяющийся таймер
    // clearInterval отменяет выполнение функции, запущенной через setInterval
    clearInterval(swInterval);
    swInterval = null;
  }
}

function resetStopwatch() {
  // Использую clearInterval, потому что нужно остановить таймер перед сбросом
  clearInterval(swInterval);
  swInterval = null;
  swSeconds = 0;
  updateStopwatch();
  localStorage.removeItem("stopwatchSeconds");
}

swStart.addEventListener("click", startStopwatch);
swStop.addEventListener("click", stopStopwatch);
swReset.addEventListener("click", resetStopwatch);

/* =====================================================
2 ОБРАТНЫЙ ОТСЧЁТ
===================================================== */
const cdInput = document.getElementById("countdown-seconds");
const cdStart = document.getElementById("cd-start");
const cdStop = document.getElementById("cd-stop");
const cdReset = document.getElementById("cd-reset");
const cdDisplay = document.getElementById("countdown-display");

let cdSeconds = 0;
let cdInterval = null;
const MAX_COUNTDOWN_SECONDS = 259200; // 3 дня = 72 часа = 259200 секунд

function startCountdown() {
  const value = cdInput.value;
  const error = validateNumberInput(value);

  if (error) {
    cdDisplay.textContent = error;
    return;
  }

  cdSeconds = Number(value);

  // Дополнительная проверка на isFinite для защиты от Infinity
  if (!Number.isFinite(cdSeconds)) {
    cdDisplay.textContent = "Ошибка: значение не может быть Infinity";
    return;
  }

  // НОВАЯ ПРОВЕРКА: Максимальное допустимое значение (3 дня)
  if (cdSeconds > MAX_COUNTDOWN_SECONDS) {
    cdDisplay.textContent = `Ошибка: максимальное время — 259200 секунд (3 дня)`;
    return;
  }

  updateCountdown();

  if (cdInterval !== null) {
    // Использую clearInterval, потому что нужно остановить предыдущий таймер перед запуском нового
    clearInterval(cdInterval);
  }

  // Использую setInterval, потому что нужно уменьшать значение каждую секунду многократно
  // setInterval выполняет функцию через равные промежутки времени (1000 мс)
  cdInterval = setInterval(() => {
    cdSeconds--;
    updateCountdown();

    if (cdSeconds <= 0) {
      // Использую clearInterval, потому что таймер достиг 0 и должен остановиться
      clearInterval(cdInterval);
      cdInterval = null;
      cdDisplay.textContent = "Время вышло!";
    }
  }, 1000);
}

function updateCountdown() {
  cdDisplay.textContent = formatMMSS(cdSeconds);
}

function stopCountdown() {
  if (cdInterval !== null) {
    // Использую clearInterval, потому что нужно остановить повторяющийся таймер
    clearInterval(cdInterval);
    cdInterval = null;
  }
}

function resetCountdown() {
  // Использую clearInterval, потому что нужно остановить таймер перед сбросом
  clearInterval(cdInterval);
  cdInterval = null;
  cdDisplay.textContent = "00:00";
  cdInput.value = "";
}

cdStart.addEventListener("click", startCountdown);
cdStop.addEventListener("click", stopCountdown);
cdReset.addEventListener("click", resetCountdown);

/* =====================================================
3 УВЕДОМЛЕНИЯ
===================================================== */
const notifyBtn = document.getElementById("notification-show");
const notifyBlock = document.getElementById("notification");
const notifyClose = document.getElementById("notification-close");

let showTimeout = null;
let hideTimeout = null;

notifyBtn.addEventListener("click", () => {
  if (showTimeout) {
    // Использую clearTimeout, потому что нужно отменить предыдущий таймер показа
    // clearTimeout отменяет выполнение функции, запущенной через setTimeout
    clearTimeout(showTimeout);
  }

  // Использую setTimeout, потому что нужно показать уведомление один раз через 3 секунды
  // setTimeout выполняет функцию только один раз после указанной задержки
  showTimeout = setTimeout(() => {
    notifyBlock.style.display = "block";

    // Использую setTimeout, потому что нужно скрыть уведомление один раз через 5 секунд
    hideTimeout = setTimeout(() => {
      notifyBlock.style.display = "none";
    }, 5000);
  }, 3000);
});

notifyClose.addEventListener("click", () => {
  // Использую clearTimeout, потому что нужно отменить автоматическое скрытие
  // clearTimeout отменяет выполнение функции, запущенной через setTimeout
  clearTimeout(hideTimeout);
  notifyBlock.style.display = "none";
});

/* =====================================================
4 ИНФОРМАЦИЯ О БРАУЗЕРЕ
===================================================== */
const infoBtn = document.getElementById("browser-info-btn");
const refreshBtn = document.getElementById("browser-info-refresh");
const infoBlock = document.getElementById("browser-info");

function showBrowserInfo() {
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  const deviceType = isMobile ? "Мобильное устройство" : "Десктоп";

  const html = `
        <ul>
            <li><strong>URL:</strong> ${location.href}</li>
            <li><strong>Протокол:</strong> ${location.protocol}</li>
            <li><strong>Домен:</strong> ${location.hostname}</li>
            <li><strong>Путь:</strong> ${location.pathname}</li>
            <li><strong>Язык:</strong> ${navigator.language}</li>
            <li><strong>Online:</strong> ${navigator.onLine ? "Да" : "Нет"}</li>
            <li><strong>UserAgent:</strong> ${navigator.userAgent.substring(0, 100)}...</li>
            <li><strong>Экран:</strong> ${screen.width} x ${screen.height}</li>
            <li><strong>Окно:</strong> ${window.innerWidth} x ${window.innerHeight}</li>
            <li><strong>Тип устройства:</strong> ${deviceType}</li>
        </ul>
    `;

  infoBlock.innerHTML = html;
}

infoBtn.addEventListener("click", showBrowserInfo);
refreshBtn.addEventListener("click", showBrowserInfo);

/* =====================================================
5 АВТОСОХРАНЕНИЕ
===================================================== */
const textarea = document.getElementById("autosave-textarea");
const indicator = document.getElementById("autosave-indicator");
const toggleBtn = document.getElementById("autosave-toggle");
const clearBtn = document.getElementById("autosave-clear");

let autosaveInterval = null;

function saveDraft() {
  const text = textarea.value.trim();
  if (text === "") return;

  localStorage.setItem("draft", text);
  indicator.textContent = "Сохранено: " + new Date().toLocaleTimeString();
}

function startAutosave() {
  // Использую setInterval, потому что нужно сохранять текст каждые 10 секунд многократно
  // setInterval выполняет функцию через равные промежутки времени (10000 мс)
  autosaveInterval = setInterval(saveDraft, 10000);
  toggleBtn.textContent = "Остановить автосохранение";
}

function stopAutosave() {
  // Использую clearInterval, потому что нужно остановить повторяющееся автосохранение
  // clearInterval отменяет выполнение функции, запущенной через setInterval
  clearInterval(autosaveInterval);
  autosaveInterval = null;
  toggleBtn.textContent = "Включить автосохранение";
}

toggleBtn.addEventListener("click", () => {
  if (autosaveInterval) {
    stopAutosave();
  } else {
    startAutosave();
  }
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("draft");
  textarea.value = "";
  indicator.textContent = "Черновик удалён";
});

/* =====================================================
6 POMODORO
===================================================== */
const pomDisplay = document.getElementById("pomodoro-display");
const pomStart = document.getElementById("pomodoro-start");
const pomPause = document.getElementById("pomodoro-pause");
const pomReset = document.getElementById("pomodoro-reset");
const pomCount = document.getElementById("pomodoro-count");
const pomShowHistory = document.getElementById("pomodoro-show-history");
const pomClearHistory = document.getElementById("pomodoro-clear-history");
const pomHistory = document.getElementById("pomodoro-history");

let pomSecondsStartValue = 3; // 25 минут
let pomSeconds = pomSecondsStartValue;
let pomInterval = null;
let completedSessions = 0;
let isTimerCompleted = false;

function updatePomodoro() {
  pomDisplay.textContent = formatMMSS(pomSeconds);
}

function updateSessionCount() {
  pomCount.textContent = completedSessions;
}

function startPomodoro() {
  if (pomInterval !== null) return;

  // Если таймер завершён — сбрасываем время на 25 минут для нового запуска
  if (isTimerCompleted) {
    pomSeconds = pomSecondsStartValue;
    isTimerCompleted = false;
    updatePomodoro();
  }

  // Использую setInterval, потому что нужно уменьшать таймер каждую секунду многократно
  // setInterval выполняет функцию через равные промежутки времени (1000 мс)
  pomInterval = setInterval(() => {
    pomSeconds--;
    updatePomodoro();

    if (pomSeconds <= 0) {
      // Использую clearInterval, потому что таймер достиг 0 и должен остановиться
      // clearInterval отменяет выполнение функции, запущенной через setInterval
      clearInterval(pomInterval);
      pomInterval = null;
      isTimerCompleted = true;

      // Увеличиваем счётчик завершённых сессий
      completedSessions++;
      updateSessionCount();

      // Сохраняем сессию в историю (localStorage)
      saveSessionToHistory();

      // Вывод через DOM, а не alert (по требованию задания)
      pomDisplay.textContent = "⏰ Время на перерыв!";
    }
  }, 1000);
}

function pausePomodoro() {
  // Использую clearInterval, потому что нужно остановить повторяющийся таймер
  // clearInterval отменяет выполнение функции, запущенной через setInterval
  clearInterval(pomInterval);
  pomInterval = null;
}

function resetPomodoro() {
  // Использую clearInterval, потому что нужно остановить таймер перед сбросом
  // clearInterval отменяет выполнение функции, запущенной через setInterval
  clearInterval(pomInterval);
  pomInterval = null;
  pomSeconds = pomSecondsStartValue;
  isTimerCompleted = false;
  updatePomodoro();
}

// Сохранение истории сессий в localStorage
function saveSessionToHistory() {
  const history = JSON.parse(localStorage.getItem("pomodoroHistory") || "[]");
  const now = new Date();
  history.push({
    date: now.toLocaleDateString("ru-RU"),
    time: now.toLocaleTimeString("ru-RU"),
    duration: pomSecondsStartValue / 60,
  });
  localStorage.setItem("pomodoroHistory", JSON.stringify(history));
}

// Показать историю
pomShowHistory.addEventListener("click", () => {
  const history = JSON.parse(localStorage.getItem("pomodoroHistory") || "[]");
  if (history.length === 0) {
    pomHistory.textContent = "История пуста";
  } else {
    const historyText = history
      .map((s) => `${s.date} ${s.time} — ${s.duration} мин`)
      .join(", ");
    pomHistory.textContent = historyText;
  }
});

// Очистить историю
pomClearHistory.addEventListener("click", () => {
  localStorage.removeItem("pomodoroHistory");
  completedSessions = 0; // СБРОС СЧЁТЧИКА СЕССИЙ
  updateSessionCount(); // ОБНОВЛЕНИЕ ОТОБРАЖЕНИЯ
  pomHistory.textContent = "История очищена";
});

// Обработчики кнопок
pomStart.addEventListener("click", startPomodoro);
pomPause.addEventListener("click", pausePomodoro);
pomReset.addEventListener("click", resetPomodoro);

// Инициализация при загрузке
updatePomodoro();
updateSessionCount();

/* =====================================================
7 ДИАЛОГОВЫЕ ОКНА
===================================================== */
const alertBtn = document.getElementById("btn-alert");
const confirmBtn = document.getElementById("btn-confirm");
const promptBtn = document.getElementById("btn-prompt");
const dialogResult = document.getElementById("dialog-result");

alertBtn.addEventListener("click", () => {
  alert("Это alert()");
  dialogResult.textContent = "Alert был показан";
});

confirmBtn.addEventListener("click", () => {
  const result = confirm("Вы уверены?");
  dialogResult.textContent = result ? "Нажато OK" : "Нажато Cancel";
});

promptBtn.addEventListener("click", () => {
  const name = prompt("Введите имя");
  if (name === null) {
    dialogResult.textContent = "Пользователь отменил ввод";
  } else if (name.trim() === "") {
    dialogResult.textContent = "Пустая строка";
  } else {
    dialogResult.textContent = "Привет, " + name;
  }
});

/* =====================================================
ONLINE / OFFLINE (ADVANCED)
===================================================== */
const onlineStatus = document.getElementById("online-status");

window.addEventListener("online", () => {
  // Вывод через DOM, а не alert
  if (onlineStatus) {
    onlineStatus.textContent = "🟢 Интернет соединение восстановлено";
    onlineStatus.className = "status-message success";
    onlineStatus.style.display = "block";
    setTimeout(() => {
      onlineStatus.style.display = "none";
    }, 3000);
  }
  console.log("Интернет соединение восстановлено");
});

window.addEventListener("offline", () => {
  // Вывод через DOM, а не alert
  if (onlineStatus) {
    onlineStatus.textContent = "🔴 Вы офлайн";
    onlineStatus.className = "status-message error";
    onlineStatus.style.display = "block";
  }
  console.log("Вы офлайн");
});

/* =====================================================
ВОССТАНОВЛЕНИЕ СОСТОЯНИЯ
===================================================== */
window.addEventListener("load", () => {
  // Восстановление черновика из localStorage
  const draft = localStorage.getItem("draft");
  if (draft) {
    textarea.value = draft;
  }

  // Восстановление секундомера из localStorage
  const savedStopwatch = localStorage.getItem("stopwatchSeconds");
  if (savedStopwatch) {
    swSeconds = Number(savedStopwatch);
    updateStopwatch();
  }

  // Запуск автосохранения при загрузке
  startAutosave();

  // Инициализация Pomodoro
  updatePomodoro();
  updateSessionCount();
});
