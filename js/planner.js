// =========================================================
// Academic Planner — interactive task management system
// Demonstrates: arrays & functions, DOM manipulation,
// event handling, dynamic content updates.
// =========================================================

(function () {
  const STORAGE_KEY = 'ff-academic-planner-tasks';

  // ---- Elements ----
  const form = document.getElementById('taskForm');
  const input = document.getElementById('taskInput');
  const dateInput = document.getElementById('taskDate');
  const priorityInput = document.getElementById('taskPriority');
  const list = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const statTotal = document.getElementById('statTotal');
  const statDone = document.getElementById('statDone');
  const statPending = document.getElementById('statPending');

  if (!form) return; // planner.js loaded on a page without the planner — bail safely

  // ---- State: array of task objects ----
  let tasks = loadTasks();
  let currentFilter = 'all';

  // ---- Persistence helpers ----
  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : seedTasks();
    } catch (err) {
      console.warn('Could not read saved tasks, starting fresh.', err);
      return seedTasks();
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.warn('Could not save tasks.', err);
    }
  }

  // A couple of starter tasks so the planner isn't empty on first visit
  function seedTasks() {
    return [
      { id: cryptoId(), title: 'Submit Cyber Threat Management assignment', date: '', priority: 'high', done: false },
      { id: cryptoId(), title: 'Review generative AI research notes', date: '', priority: 'medium', done: false }
    ];
  }

  function cryptoId() {
    return 't-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  }

  // ---- Rendering ----
  function render() {
    const visible = tasks.filter(t => {
      if (currentFilter === 'pending') return !t.done;
      if (currentFilter === 'done') return t.done;
      return true;
    });

    list.innerHTML = '';

    if (visible.length === 0) {
      emptyState.style.display = 'block';
      emptyState.textContent = tasks.length === 0
        ? 'Your planner is empty. Add your first task above.'
        : 'No tasks match this filter.';
    } else {
      emptyState.style.display = 'none';
      visible.forEach(task => list.appendChild(buildTaskItem(task)));
    }

    updateStats();
  }

  function buildTaskItem(task) {
    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority}${task.done ? ' done' : ''}`;
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Mark "${task.title}" as ${task.done ? 'pending' : 'completed'}`);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const body = document.createElement('div');
    body.className = 'task-body';

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    const priorityLabel = document.createElement('span');
    priorityLabel.textContent = task.priority.toUpperCase() + ' PRIORITY';
    meta.appendChild(priorityLabel);
    if (task.date) {
      const dateLabel = document.createElement('span');
      dateLabel.textContent = 'DUE ' + formatDate(task.date);
      meta.appendChild(dateLabel);
    }

    body.appendChild(title);
    body.appendChild(meta);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete';
    deleteBtn.innerHTML = '&#10005;';
    deleteBtn.setAttribute('aria-label', `Delete "${task.title}"`);
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(body);
    li.appendChild(deleteBtn);
    return li;
  }

  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    statTotal.textContent = total;
    statDone.textContent = done;
    statPending.textContent = total - done;
  }

  // ---- Task operations (array manipulation) ----
  function addTask(title, date, priority) {
    tasks.push({ id: cryptoId(), title, date, priority, done: false });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
  }

  // ---- Event listeners ----
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) {
      input.focus();
      return;
    }
    addTask(title, dateInput.value, priorityInput.value);
    form.reset();
    priorityInput.value = 'medium';
    input.focus();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // ---- Initial render ----
  render();
})();
      
