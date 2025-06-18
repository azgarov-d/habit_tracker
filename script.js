let habits = JSON.parse(localStorage.getItem('habits')) || [];
let moods = JSON.parse(localStorage.getItem('moods')) || {};
let goals = JSON.parse(localStorage.getItem('goals')) || [];
let reflections = JSON.parse(localStorage.getItem('reflections')) || [];
let chartInstance = null;

const habitForm = document.getElementById('habit-form');
const habitModal = document.getElementById('habit-modal');
const addHabitBtn = document.getElementById('add-habit-btn');
const cancelHabitBtn = document.getElementById('cancel-habit');
const habitGrid = document.getElementById('habit-grid');
const moodNote = document.getElementById('mood-note');
const saveMoodBtn = document.getElementById('save-mood');
const goalForm = document.getElementById('goal-form');
const goalModal = document.getElementById('goal-modal');
const addGoalBtn = document.getElementById('add-goal-btn');
const cancelGoalBtn = document.getElementById('cancel-goal');
const goalGrid = document.getElementById('goal-grid');
const reflectionForm = document.getElementById('reflection-form');
const reflectionModal = document.getElementById('reflection-modal');
const cancelReflectionBtn = document.getElementById('cancel-reflection');
const weeklyReflectionBtn = document.getElementById('weekly-reflection-btn');
const motivationalQuote = document.getElementById('motivational-quote');
const themeToggle = document.getElementById('theme-toggle');
const languageSelect = document.getElementById('language-select');

function init() {
    loadTheme();
    loadLanguage();
    updateHabitGrid();
    updateMoodChart();
    updateGoalGrid();
    updateQuote();
    setupEventListeners();
}

function updateHabitGrid() {
    const lang = document.body.dataset.lang || 'uz';
    habitGrid.innerHTML = '';
    if (habits.length === 0) {
        habitGrid.innerHTML = `<p class="no-habits" data-i18n="no_habits">${translations[lang].no_habits}</p>`;
        return;
    }

    habits.forEach((habit, index) => {
        const streak = calculateStreak(habit);
        const successRate = calculateSuccessRate(habit);
        const card = document.createElement('div');
        card.className = 'habit-card';
        const today = new Date().toISOString().split('T')[0];
        const isChecked = habit.completions[today] || false;
        card.innerHTML = `
            <h3>${habit.name}</h3>
            <p class="streak">${translations[lang].streak.replace('{streak}', streak)}</p>
            <p class="success-rate">${translations[lang].success_rate.replace('{rate}', successRate)}</p>
            <div class="actions">
                <button class="btn btn-primary check-btn ${isChecked ? 'active' : ''}" data-index="${index}" data-i18n="mark_complete">${translations[lang].mark_complete}</button>
                <button class="btn btn-icon btn-danger delete-btn" data-index="${index}">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM9 9h6v6H9z"/>
                    </svg>
                </button>
            </div>
        `;
        habitGrid.appendChild(card);
    });

    document.querySelectorAll('.check-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleHabitComplete(parseInt(btn.dataset.index)));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteHabit(parseInt(btn.dataset.index)));
    });
}

function calculateStreak(habit) {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);
    while (habit.completions[currentDate.toISOString().split('T')[0]]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
}

function calculateSuccessRate(habit) {
    const today = new Date();
    let completedDays = 0;
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        if (habit.completions[dateStr]) {
            completedDays++;
        }
    }
    return (completedDays / 30 * 100).toFixed(0);
}

function updateMoodChart() {
    const lang = document.body.dataset.lang || 'uz';
    const today = new Date();
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        labels.push(date.toLocaleDateString(lang));
        const dateStr = date.toISOString().split('T')[0];
        data.push(moods[dateStr]?.mood || 0);
    }

    if (chartInstance) {
        chartInstance.destroy();
    }

    const ctx = document.getElementById('mood-chart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: translations[lang].mood_tracker,
                data,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: value => ['😔', '😐', '😊', '😄', '🤩'][value - 1] || '',
                        color: document.body.dataset.theme === 'dark' ? '#f9fafb' : '#111827'
                    },
                    title: {
                        display: true,
                        text: translations[lang].mood_tracker,
                        color: document.body.dataset.theme === 'dark' ? '#f9fafb' : '#111827'
                    }
                },
                x: {
                    ticks: {
                        color: document.body.dataset.theme === 'dark' ? '#f9fafb' : '#111827'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: document.body.dataset.theme === 'dark' ? '#f9fafb' : '#111827'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuad'
            }
        }
    });
}

function updateGoalGrid() {
    const lang = document.body.dataset.lang || 'uz';
    goalGrid.innerHTML = '';
    if (goals.length === 0) {
        goalGrid.innerHTML = `<p class="no-goals" data-i18n="no_goals">${translations[lang].no_goals}</p>`;
        return;
    }

    goals.forEach((goal, index) => {
        const progress = calculateGoalProgress(goal);
        const daysLeft = calculateDaysLeft(goal.deadline);
        const card = document.createElement('div');
        card.className = 'goal-card';
        card.innerHTML = `
            <h3>${goal.name}</h3>
            <p class="deadline">${translations[lang].days_left.replace('{days}', daysLeft)}</p>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <p class="progress-text">${translations[lang].progress.replace('{progress}', progress)}</p>
            </div>
            <div class="subtasks">
                ${goal.subtasks.map((subtask, subIndex) => `
                    <div class="subtask">
                        <input type="checkbox" id="subtask-${index}-${subIndex}" ${subtask.completed ? 'checked' : ''} data-goal="${index}" data-subtask="${subIndex}">
                        <label for="subtask-${index}-${subIndex}">${subtask.name}</label>
                    </div>
                `).join('')}
            </div>
            <div class="actions">
                <button class="btn btn-icon btn-danger delete-btn" data-index="${index}">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM9 9h6v6H9z"/>
                    </svg>
                </button>
            </div>
        `;
        goalGrid.appendChild(card);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteGoal(parseInt(btn.dataset.index)));
    });
    document.querySelectorAll('.subtask input').forEach(input => {
        input.addEventListener('change', () => toggleSubtask(parseInt(input.dataset.goal), parseInt(input.dataset.subtask)));
    });
}

function calculateGoalProgress(goal) {
    const completed = goal.subtasks.filter(subtask => subtask.completed).length;
    return (completed / goal.subtasks.length * 100).toFixed(0);
}

function calculateDaysLeft(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function updateQuote() {
    const lang = document.body.dataset.lang || 'uz';
    const maxStreak = Math.max(...habits.map(habit => calculateStreak(habit)), 0);
    motivationalQuote.textContent = maxStreak > 0
        ? translations[lang].quote_streak.replace('{streak}', maxStreak)
        : translations[lang].quote_default;
}
function handleHabitSubmit(e) {
    e.preventDefault();
    const lang = document.body.dataset.lang || 'uz';
    const name = document.getElementById('habit-name').value.trim();

    if (!name) {
        alert(translations[lang].duplicate_habit);
        return;
    }

    if (habits.some(habit => habit.name.toLowerCase() === name.toLowerCase())) {
        alert(translations[lang].duplicate_habit);
        return;
    }

    habits.push({
        id: crypto.randomUUID(),
        name,
        completions: {}
    });

    saveHabits();
    updateHabitGrid();
    updateQuote();
    habitForm.reset();
    habitModal.close();
}

function toggleHabitComplete(index) {
    const today = new Date().toISOString().split('T')[0];
    habits[index].completions[today] = !habits[index].completions[today];
    saveHabits();
    updateHabitGrid();
    updateQuote();
}

function deleteHabit(index) {
    const lang = document.body.dataset.lang || 'uz';
    if (confirm(translations[lang].confirm_delete)) {
        habits.splice(index, 1);
        saveHabits();
        updateHabitGrid();
        updateQuote();
    }
}

function handleSaveMood() {
    const lang = document.body.dataset.lang || 'uz';
    const mood = document.querySelector('.mood-btn.active')?.dataset.mood;
    const note = moodNote.value.trim();
    if (!mood) {
        alert(translations[lang].mood_tracker + ': ' + translations[lang].save_mood);
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    moods[today] = { mood: parseInt(mood), note };
    saveMoods();
    updateMoodChart();
    moodNote.value = '';
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
}

function handleGoalSubmit(e) {
    e.preventDefault();
    const lang = document.body.dataset.lang || 'uz';
    const name = document.getElementById('goal-name').value.trim();
    const deadline = document.getElementById('goal-deadline').value;
    const subtasks = document.getElementById('subtasks').value.split('\n').map(s => s.trim()).filter(s => s);

    if (!name || !deadline || subtasks.length === 0) {
        alert(translations[lang].duplicate_goal);
        return;
    }

    if (goals.some(goal => goal.name.toLowerCase() === name.toLowerCase())) {
        alert(translations[lang].duplicate_goal);
        return;
    }

    goals.push({
        id: crypto.randomUUID(),
        name,
        deadline,
        subtasks: subtasks.map(name => ({ name, completed: false }))
    });

    saveGoals();
    updateGoalGrid();
    goalForm.reset();
    goalModal.close();
}

function toggleSubtask(goalIndex, subtaskIndex) {
    goals[goalIndex].subtasks[subtaskIndex].completed = !goals[goalIndex].subtasks[subtaskIndex].completed;
    saveGoals();
    updateGoalGrid();
}

function deleteGoal(index) {
    const lang = document.body.dataset.lang || 'uz';
    if (confirm(translations[lang].confirm_delete)) {
        goals.splice(index, 1);
        saveGoals();
        updateGoalGrid();
    }
}

function handleReflectionSubmit(e) {
    e.preventDefault();
    const lang = document.body.dataset.lang || 'uz';
    const text = document.getElementById('reflection-text').value.trim();
    if (!text) {
        alert(translations[lang].weekly_reflection + ': ' + translations[lang].save);
        return;
    }

    reflections.push({
        date: new Date().toISOString().split('T')[0],
        text
    });

    saveReflections();
    reflectionForm.reset();
    reflectionModal.close();
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

function saveMoods() {
    localStorage.setItem('moods', JSON.stringify(moods));
}

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

function saveReflections() {
    localStorage.setItem('reflections', JSON.stringify(reflections));
}

function toggleTheme() {
    const isDark = document.body.dataset.theme === 'dark';
    document.body.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', document.body.dataset.theme);
    updateMoodChart();
}

function setupEventListeners() {
    addHabitBtn.addEventListener('click', () => {
        document.getElementById('habit-modal').querySelector('h2').textContent = translations[document.body.dataset.lang || 'uz'].add_habit;
        habitForm.reset();
        habitModal.showModal();
    });
    habitForm.addEventListener('submit', handleHabitSubmit);
    cancelHabitBtn.addEventListener('click', () => habitModal.close());

    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    saveMoodBtn.addEventListener('click', handleSaveMood);

    addGoalBtn.addEventListener('click', () => {
        document.getElementById('goal-modal').querySelector('h2').textContent = translations[document.body.dataset.lang || 'uz'].add_goal;
        goalForm.reset();
        goalModal.showModal();
    });
    goalForm.addEventListener('submit', handleGoalSubmit);
    cancelGoalBtn.addEventListener('click', () => goalModal.close());

    weeklyReflectionBtn.addEventListener('click', () => {
        reflectionForm.reset();
        reflectionModal.showModal();
    });
    reflectionForm.addEventListener('submit', handleReflectionSubmit);
    cancelReflectionBtn.addEventListener('click', () => reflectionModal.close());

    themeToggle.addEventListener('click', toggleTheme);

    languageSelect.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
        updateHabitGrid();
        updateMoodChart();
        updateGoalGrid();
        updateQuote();
    });
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;
}

document.addEventListener('DOMContentLoaded', init);
