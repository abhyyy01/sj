// Full-Featured Student Workload Management System
let appData = {
    tasks: [],
    grades: [],
    mentalHealth: [],
    initialized: false,
    settings: {
        moodReminder: true,
        moodReminderTime: '09:00',
        taskReminder: true,
        reminderHours: 24,
        animations: true,
        lastMoodCheck: null
    },
    user: {isLoggedIn: false, name: '', email: ''}
};

function loadData() {
    const stored = localStorage.getItem('swmsData');
    if (stored) appData = JSON.parse(stored);
    if (!appData.initialized) initializeSampleData();
}

function saveData() {
    localStorage.setItem('swmsData', JSON.stringify(appData));
}

function initializeSampleData() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    appData.tasks = [
        {id: Date.now(), title: 'Complete Assignment', description: 'Data Structures', dueDate: tomorrow.toISOString().split('T')[0], priority: 'high', completed: false},
        {id: Date.now() + 1, title: 'Study for Exam', description: 'Calculus', dueDate: nextWeek.toISOString().split('T')[0], priority: 'high', completed: false},
        {id: Date.now() + 2, title: 'Read Chapter', description: 'Psychology', dueDate: nextWeek.toISOString().split('T')[0], priority: 'medium', completed: false}
    ];

    appData.grades = [
        {id: Date.now(), course: 'Data Structures', grade: 3.7, credits: 4, date: '2026-09-01'},
        {id: Date.now() + 1, course: 'Calculus II', grade: 3.5, credits: 4, date: '2026-09-05'},
        {id: Date.now() + 2, course: 'Psychology', grade: 3.9, credits: 3, date: '2026-09-10'}
    ];

    appData.mentalHealth = [
        {date: '2026-09-14', stress: 5, anxiety: 4, mood: 4, sleep: 7.5},
        {date: '2026-09-15', stress: 8, anxiety: 7, mood: 2, sleep: 5.5},
        {date: '2026-09-16', stress: 6, anxiety: 5, mood: 3, sleep: 7},
        {date: '2026-09-17', stress: 4, anxiety: 3, mood: 4, sleep: 8},
        {date: '2026-09-18', stress: 5, anxiety: 4, mood: 4, sleep: 7.5}
    ];

    appData.initialized = true;
    saveData();
}

// ==================== LOGIN & AUTH ====================
function setupLoginHandlers() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginContent = document.querySelector('.login-content');
    const signupContent = document.querySelector('.signup-content');

    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContent.style.display = 'none';
            signupContent.style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupContent.style.display = 'none';
            loginContent.style.display = 'block';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            if (email && password) {
                appData.user.isLoggedIn = true;
                appData.user.email = email;
                appData.user.name = email.split('@')[0];
                saveData();
                showMainApp();
                showNotification('Welcome! 🎉');
            } else {
                showNotification('Please fill in all fields');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;

            if (password !== confirm) {
                showNotification('Passwords do not match!');
                return;
            }

            if (name && email && password) {
                appData.user.isLoggedIn = true;
                appData.user.name = name;
                appData.user.email = email;
                saveData();
                showMainApp();
                showNotification('Account created! Welcome 🎉');
            } else {
                showNotification('Please fill in all fields');
            }
        });
    }
}

function showLoginPage() {
    const loginPage = document.getElementById('login-page');
    const appContainer = document.querySelector('.app-container');
    if (loginPage) loginPage.classList.add('active');
    if (appContainer) appContainer.style.display = 'none';
}

function showMainApp() {
    const loginPage = document.getElementById('login-page');
    const appContainer = document.querySelector('.app-container');
    if (loginPage) loginPage.classList.remove('active');
    if (appContainer) appContainer.style.display = 'grid';
    setupMobileMenu();
    setupAllEventHandlers();
    switchView('dashboard');
}

// ==================== VIEW SWITCHING ====================
function switchView(view) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });

    // Show selected view
    const viewMap = {
        'dashboard': 'dashboard-view',
        'performance': 'performance-view',
        'mental': 'mental-health-view',
        'mental-health': 'mental-health-view',
        'tasks': 'tasks-view',
        'settings': 'settings-view'
    };

    const viewId = viewMap[view] || `${view}-view`;
    const section = document.getElementById(viewId);
    if (section) {
        section.style.display = 'block';
        section.classList.add('active');
    }

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`[data-view="${view}"]`);
    if (navItem) navItem.classList.add('active');

    // Render view content
    if (view === 'dashboard') renderDashboard();
    else if (view === 'performance') renderPerformance();
    else if (view === 'mental' || view === 'mental-health') renderMentalHealth();
    else if (view === 'tasks') renderTasks();
    else if (view === 'settings') renderSettings();

    // Close mobile menu
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

// ==================== DASHBOARD VIEW ====================
function renderDashboard() {
    updateDashboardStats();
    renderWeeklyPolygon();
    renderUpcomingDeadlines();
}

function updateDashboardStats() {
    const totalTasks = appData.tasks.length;
    const completedTasks = appData.tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const avgGrade = appData.grades.length > 0
        ? (appData.grades.reduce((s, g) => s + g.grade, 0) / appData.grades.length).toFixed(2)
        : 0;

    const latestMental = appData.mentalHealth[appData.mentalHealth.length - 1];
    const stressLevel = latestMental ? (latestMental.stress > 6 ? 'High' : latestMental.stress > 3 ? 'Medium' : 'Low') : 'Low';

    document.getElementById('pending-tasks').textContent = totalTasks - completedTasks;
    document.getElementById('current-gpa').textContent = avgGrade;
    document.getElementById('completion-rate').textContent = completionRate + '%';
    document.getElementById('stress-level').textContent = stressLevel;

    // Update current date
    const today = new Date();
    document.getElementById('current-date').textContent = today.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});
}

function renderWeeklyPolygon() {
    const canvas = document.getElementById('weeklyPolygon');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [7, 8, 6, 8, 9, 7, 6]; // Sample performance data
    const sides = data.length;
    const radius = Math.min(canvas.width, canvas.height) / 2.5;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw background circle
    ctx.fillStyle = 'rgba(107, 196, 166, 0.05)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Draw polygon
    ctx.strokeStyle = '#6bc4a6';
    ctx.fillStyle = 'rgba(107, 196, 166, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + (radius * data[i] / 10) * Math.cos(angle);
        const y = centerY + (radius * data[i] / 10) * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#6bc4a6';
    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + (radius * data[i] / 10) * Math.cos(angle);
        const y = centerY + (radius * data[i] / 10) * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw labels
    ctx.fillStyle = '#2c2c2c';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + (radius + 25) * Math.cos(angle);
        const y = centerY + (radius + 25) * Math.sin(angle);
        ctx.fillText(days[i], x, y);
    }
}

function renderUpcomingDeadlines() {
    const deadlinesList = document.getElementById('deadlines-list');
    if (!deadlinesList) return;

    const upcoming = appData.tasks
        .filter(t => !t.completed)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    if (upcoming.length === 0) {
        deadlinesList.innerHTML = '<p class="empty-state">No upcoming deadlines</p>';
    } else {
        deadlinesList.innerHTML = upcoming.map(t => `
            <div class="deadline-item priority-${t.priority}">
                <div class="deadline-info">
                    <h4>${t.title}</h4>
                    <p>${t.description || 'No description'}</p>
                </div>
                <div class="deadline-date">${new Date(t.dueDate).toLocaleDateString()}</div>
            </div>
        `).join('');
    }
}

// ==================== PERFORMANCE VIEW ====================
function renderPerformance() {
    renderGPACard();
    renderGradesList();
    renderCompletionCircle();
}

function renderGPACard() {
    const gpaValue = document.getElementById('perf-gpa');
    if (!gpaValue) return;

    const avgGrade = appData.grades.length > 0
        ? (appData.grades.reduce((s, g) => s + g.grade, 0) / appData.grades.length).toFixed(2)
        : 0;

    gpaValue.textContent = avgGrade;

    // Draw GPA chart
    const canvas = document.getElementById('gpaChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const grades = appData.grades.map(g => g.grade);
        const maxGrade = 4.0;
        const barWidth = canvas.width / (grades.length + 1);

        grades.forEach((grade, i) => {
            const barHeight = (grade / maxGrade) * (canvas.height - 30);
            const x = (i + 0.5) * barWidth;
            const y = canvas.height - barHeight - 20;

            // Draw bar
            ctx.fillStyle = '#6bc4a6';
            ctx.fillRect(x - barWidth / 3, y, barWidth / 1.5, barHeight);

            // Draw value
            ctx.fillStyle = '#2c2c2c';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(grade.toFixed(1), x, y - 5);
        });
    }
}

function renderGradesList() {
    const gradesList = document.getElementById('grades-list');
    if (!gradesList) return;

    if (appData.grades.length === 0) {
        gradesList.innerHTML = '<p class="empty-state">No grades recorded yet</p>';
    } else {
        gradesList.innerHTML = appData.grades.map(g => `
            <div class="grade-item">
                <div>
                    <strong>${g.course}</strong>
                    <br><small>${g.date} • ${g.credits} credits</small>
                </div>
                <div class="grade-value">${g.grade}</div>
            </div>
        `).join('');
    }
}

function renderCompletionCircle() {
    const totalTasks = appData.tasks.length;
    const completedTasks = appData.tasks.filter(t => t.completed).length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    document.getElementById('completed-count').textContent = completedTasks;
    document.getElementById('total-count').textContent = totalTasks;
    document.getElementById('completion-percentage').textContent = Math.round(percentage) + '%';

    const circle = document.getElementById('completion-circle');
    if (circle) {
        const circumference = 31.831 * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = offset;
    }
}

// ==================== MENTAL HEALTH VIEW ====================
function renderMentalHealth() {
    setupAssessmentForm();
    renderStressTrend();
    renderMoodHistory();
}

function setupAssessmentForm() {
    const stressSlider = document.getElementById('stress-slider');
    const anxietySlider = document.getElementById('anxiety-slider');
    const sleepHours = document.getElementById('sleep-hours');
    const assessmentForm = document.getElementById('assessment-form');
    const moodBtns = document.querySelectorAll('.mood-btn');

    let selectedMood = 3;

    if (stressSlider) {
        stressSlider.addEventListener('input', (e) => {
            document.getElementById('stress-value').textContent = e.target.value;
        });
    }

    if (anxietySlider) {
        anxietySlider.addEventListener('input', (e) => {
            document.getElementById('anxiety-value').textContent = e.target.value;
        });
    }

    moodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            moodBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMood = btn.dataset.mood;
        });
    });

    if (assessmentForm) {
        assessmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const today = new Date().toISOString().split('T')[0];
            const entry = {
                date: today,
                stress: parseInt(stressSlider.value),
                anxiety: parseInt(anxietySlider.value),
                mood: parseInt(selectedMood),
                sleep: parseFloat(sleepHours.value)
            };

            const existing = appData.mentalHealth.find(m => m.date === today);
            if (existing) {
                Object.assign(existing, entry);
            } else {
                appData.mentalHealth.push(entry);
            }

            saveData();
            showNotification('Assessment saved! 😊');
            renderMentalHealth();
        });
    }
}

function renderStressTrend() {
    const canvas = document.getElementById('stressChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const last7Days = appData.mentalHealth.slice(-7);
    const stressData = last7Days.map(m => m.stress);
    const labels = last7Days.map(m => new Date(m.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}));

    const barWidth = canvas.width / (last7Days.length + 1);
    const maxStress = 10;

    last7Days.forEach((entry, i) => {
        const barHeight = (entry.stress / maxStress) * (canvas.height - 30);
        const x = (i + 0.5) * barWidth;
        const y = canvas.height - barHeight - 20;

        ctx.fillStyle = entry.stress > 7 ? '#ff6b6b' : entry.stress > 4 ? '#ffa500' : '#6bc4a6';
        ctx.fillRect(x - barWidth / 3, y, barWidth / 1.5, barHeight);

        ctx.fillStyle = '#2c2c2c';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x, canvas.height - 5);
    });
}

function renderMoodHistory() {
    const moodHistoryList = document.getElementById('mood-history-list');
    if (!moodHistoryList) return;

    if (appData.mentalHealth.length === 0) {
        moodHistoryList.innerHTML = '<p class="empty-state">No mood records yet</p>';
    } else {
        moodHistoryList.innerHTML = appData.mentalHealth.slice().reverse().slice(0, 10).map(m => {
            const moodEmoji = m.mood <= 2 ? '😢' : m.mood <= 4 ? '😐' : '😊';
            return `
                <div class="mood-history-item">
                    <div class="mood-history-date">${new Date(m.date).toLocaleDateString()}</div>
                    <div class="mood-history-data">
                        <span>${moodEmoji} Mood: ${m.mood}</span>
                        <span>🔥 Stress: ${m.stress}</span>
                        <span>😰 Anxiety: ${m.anxiety}</span>
                        <span>😴 Sleep: ${m.sleep}h</span>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ==================== TASKS VIEW ====================
function renderTasks() {
    renderTasksList('all');
    setupTaskFilters();
}

function renderTasksList(filter = 'all') {
    const tasksList = document.getElementById('tasks-list');
    if (!tasksList) return;

    let filtered = appData.tasks;
    if (filter === 'pending') filtered = appData.tasks.filter(t => !t.completed);
    else if (filter === 'completed') filtered = appData.tasks.filter(t => t.completed);

    if (filtered.length === 0) {
        tasksList.innerHTML = '<p class="empty-state">No tasks in this category</p>';
    } else {
        tasksList.innerHTML = filtered.map(t => `
            <div class="task-item priority-${t.priority} ${t.completed ? 'completed' : ''}">
                <div class="task-checkbox">
                    <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${t.id})">
                </div>
                <div class="task-content">
                    <h4>${t.title}</h4>
                    <p>${t.description || 'No description'}</p>
                    <div class="task-meta">
                        <span>📅 ${new Date(t.dueDate).toLocaleDateString()}</span>
                        <span class="priority-badge">${t.priority.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function setupTaskFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasksList(btn.dataset.filter);
        });
    });
}

function toggleTask(id) {
    const task = appData.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveData();
        renderTasks();
    }
}

// ==================== SETTINGS VIEW ====================
function renderSettings() {
    setupSettingsHandlers();
}

function setupSettingsHandlers() {
    // Mood reminder toggle
    const moodToggle = document.getElementById('mood-reminder-toggle');
    if (moodToggle) {
        moodToggle.checked = appData.settings.moodReminder;
        moodToggle.addEventListener('change', (e) => {
            appData.settings.moodReminder = e.target.checked;
            saveData();
            showNotification('Reminder settings updated');
        });
    }

    // Mood reminder time
    const moodTime = document.getElementById('mood-reminder-time');
    if (moodTime) {
        moodTime.value = appData.settings.moodReminderTime;
        moodTime.addEventListener('change', (e) => {
            appData.settings.moodReminderTime = e.target.value;
            saveData();
        });
    }

    // Task reminder toggle
    const taskToggle = document.getElementById('task-reminder-toggle');
    if (taskToggle) {
        taskToggle.checked = appData.settings.taskReminder;
        taskToggle.addEventListener('change', (e) => {
            appData.settings.taskReminder = e.target.checked;
            saveData();
            showNotification('Reminder settings updated');
        });
    }

    // Reminder hours
    const reminderHours = document.getElementById('reminder-hours');
    if (reminderHours) {
        reminderHours.value = appData.settings.reminderHours;
        reminderHours.addEventListener('change', (e) => {
            appData.settings.reminderHours = parseInt(e.target.value);
            saveData();
        });
    }

    // Animations toggle
    const animToggle = document.getElementById('animations-toggle');
    if (animToggle) {
        animToggle.checked = appData.settings.animations;
        animToggle.addEventListener('change', (e) => {
            appData.settings.animations = e.target.checked;
            saveData();
            document.body.style.animation = e.target.checked ? '' : 'none';
        });
    }

    // Export data
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataStr = JSON.stringify(appData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = 'swms-data.json';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            showNotification('Data exported!');
        });
    }

    // Clear data
    const clearBtn = document.getElementById('clear-data-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure? This will delete all your data.')) {
                localStorage.clear();
                appData = {
                    tasks: [], grades: [], mentalHealth: [],
                    initialized: false,
                    settings: {moodReminder: true, moodReminderTime: '09:00', taskReminder: true, reminderHours: 24, animations: true, lastMoodCheck: null},
                    user: {isLoggedIn: false, name: '', email: ''}
                };
                showNotification('All data cleared');
                showLoginPage();
            }
        });
    }
}

// ==================== MODAL HANDLERS ====================
function setupMoodCheckModal() {
    const modal = document.getElementById('mood-check-modal');
    if (!modal) return;

    const moodButtons = document.querySelectorAll('.mood-number');
    let selectedMood = 5;

    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            moodButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMood = btn.dataset.mood;

            // Show emoji animation
            const emoji = document.getElementById('mood-emoji-display');
            if (emoji) {
                emoji.textContent = getMoodEmoji(selectedMood);
                emoji.style.animation = 'none';
                setTimeout(() => emoji.style.animation = 'pulse 0.5s', 10);
            }

            // Create particles
            createMoodParticles();
        });
    });

    const submitBtn = document.getElementById('submit-mood-check');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const today = new Date().toISOString().split('T')[0];
            const existing = appData.mentalHealth.find(m => m.date === today);
            if (existing) {
                existing.mood = selectedMood;
            } else {
                appData.mentalHealth.push({date: today, stress: 5, anxiety: 4, mood: selectedMood, sleep: 7});
            }
            saveData();
            modal.style.display = 'none';
            showNotification('Mood recorded! 😊');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

function getMoodEmoji(mood) {
    mood = parseInt(mood);
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😟';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😄';
}

function createMoodParticles() {
    const container = document.getElementById('mood-particles');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = '✨';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.position = 'absolute';
        particle.style.animation = `float 1s ease-out forwards`;
        particle.style.opacity = '0.8';

        const angle = (i / 8) * 2 * Math.PI;
        const distance = 60;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.style.setProperty('--tx', x + 'px');
        particle.style.setProperty('--ty', y + 'px');

        container.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

function openMoodModal() {
    const modal = document.getElementById('mood-check-modal');
    if (modal) modal.style.display = 'flex';
}

function setupGradeModal() {
    const gradeForm = document.getElementById('grade-form');
    if (!gradeForm) return;

    gradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const course = document.getElementById('course-name').value;
        const grade = parseFloat(document.getElementById('grade-value').value);
        const credits = parseInt(document.getElementById('grade-credits').value);

        if (course && grade >= 0 && grade <= 4) {
            appData.grades.push({
                id: Date.now(),
                course,
                grade,
                credits,
                date: new Date().toISOString().split('T')[0]
            });
            saveData();
            closeModal('grade-modal');
            renderPerformance();
            showNotification('Grade added! 📊');
        } else {
            showNotification('Please enter valid grade information');
        }
    });
}

function setupTaskModal() {
    const taskForm = document.getElementById('task-form');
    if (!taskForm) return;

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('task-date').value;
        const priority = document.getElementById('task-priority').value;

        if (title && dueDate) {
            appData.tasks.push({
                id: Date.now(),
                title,
                description,
                dueDate,
                priority,
                completed: false
            });
            saveData();
            closeModal('task-modal');
            renderTasks();
            showNotification('Task added! ✓');
        } else {
            showNotification('Please fill in all required fields');
        }
    });
}

function setupModalHandlers() {
    const addGradeBtn = document.getElementById('add-grade-btn');
    const addTaskBtn = document.getElementById('add-task-btn');
    const closeButtons = document.querySelectorAll('.close-btn');

    if (addGradeBtn) {
        addGradeBtn.addEventListener('click', () => openModal('grade-modal'));
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => openModal('task-modal'));
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modal;
            if (modalId) closeModal(modalId);
        });
    });

    // Close on cancel button
    document.querySelectorAll('[data-modal]').forEach(btn => {
        if (btn.classList.contains('btn-secondary')) {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal;
                if (modalId) closeModal(modalId);
            });
        }
    });

    setupGradeModal();
    setupTaskModal();
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        // Reset form if it exists
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const mobileSettingsBtn = document.getElementById('mobile-settings-btn');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (overlay) overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
        });
    }

    if (overlay && sidebar) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.style.display = 'none';
        });
    }

    if (mobileSettingsBtn) {
        mobileSettingsBtn.addEventListener('click', () => {
            switchView('settings');
        });
    }

    // Close sidebar on nav click
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.style.display = 'none';
        });
    });
}

// ==================== UTILITIES ====================
function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function setupAllEventHandlers() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            switchView(this.dataset.view);
        });
    });

    setupModalHandlers();
    setupMoodCheckModal();
    setupMobileMenu();
}

// ==================== INITIALIZATION ====================
window.quickLogin = function(email = 'student@example.com', name = 'Student') {
    appData.user.isLoggedIn = true;
    appData.user.email = email;
    appData.user.name = name;
    saveData();
    showMainApp();
    showNotification('Quick login! 🎉');
};

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupLoginHandlers();

    if (appData.user.isLoggedIn) {
        showMainApp();
    } else {
        showLoginPage();
    }
});
