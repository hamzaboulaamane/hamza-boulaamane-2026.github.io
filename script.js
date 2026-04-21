const desktop = document.getElementById('desktop');
const windowsContainer = document.getElementById('windows');
const tasks = document.getElementById('tasks');

// Templates
const templates = {
  terminal: 'terminal-template',
  cv: 'cv-template',
  education: 'education-template',
  about: 'about-template',
  projects: 'projects-template',
  certificates: 'certificates-template',
  contact: 'contact-template'
};

// Prevent duplicate windows
const openWindows = {};

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Desktop icons
desktop.querySelectorAll('.icon').forEach(icon => {

  const open = () => {
    const type = icon.dataset.window;
    if (!type) return;

    openWindow(type);
  };

  icon.addEventListener('click', open);

  icon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
});

// Open window
function openWindow(type) {
  const templateId = templates[type];
  if (!templateId) return;

  // Prevent duplicate windows
  if (openWindows[type]) {
    focusWindow(openWindows[type]);
    return;
  }

  const template = document.getElementById(templateId);
  if (!template) return;

  const win = template.content.cloneNode(true).querySelector('.window');
  windowsContainer.appendChild(win);

  openWindows[type] = win;

  makeDraggable(win);
  addTask(win);
  focusWindow(win);

  // Close
  win.querySelector('.close').addEventListener('click', () => {
    removeTask(win);
    delete openWindows[type];
    win.remove();
  });

  // MAXIMIZE BUTTON
  const maxBtn = win.querySelector('.maximize');
  if (maxBtn) {
    maxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      win.classList.toggle('maximized');
    });
  }

  // Double click header to maximize
  const header = win.querySelector('.window-header');
  if (header) {
    header.addEventListener('dblclick', () => {
      win.classList.toggle('maximized');
    });
  }

  // Terminal logic
  if (type === 'terminal') {
    const input = win.querySelector('.command-input');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const output = win.querySelector('.output');
        const cmd = input.value.trim();
        handleCommand(cmd, output);
        input.value = '';
      }
    });
  }

  // Focus on click
  win.addEventListener('mousedown', () => focusWindow(win));
}

// Focus system
function focusWindow(win) {
  win.style.zIndex = Date.now();
}

// Terminal commands
function handleCommand(cmd, output) {
  let result = '';

  switch (cmd.toLowerCase()) {
    case 'help':
      result = 'Available: help, about, projects, cv, education, clear';
      break;

    case 'about':
      result = 'Hi, I am Hamza. Welcome to HamzaOS!';
      break;

    case 'projects':
      result = 'Projects: Web Portfolio, AI Classifier...';
      break;

    case 'cv':
      openWindow('cv');
      return;

    case 'education':
      openWindow('education');
      return;

    case 'clear':
      output.innerHTML = '';
      return;

    default:
      result = `Command not found: ${cmd}`;
  }

  output.innerHTML += `<p>${result}</p>`;
  output.scrollTop = output.scrollHeight;
}

// Drag system
function makeDraggable(win) {
  const header = win.querySelector('.window-header');
  let isDown = false;
  let offsetX = 0;
  let offsetY = 0;

  function startDrag(e) {

    // prevent dragging if maximized
    if (win.classList.contains('maximized')) return;

    isDown = true;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    offsetX = clientX - win.offsetLeft;
    offsetY = clientY - win.offsetTop;

    focusWindow(win);
  }

  function drag(e) {
    if (!isDown) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    win.style.left = clientX - offsetX + 'px';
    win.style.top = clientY - offsetY + 'px';
  }

  function stopDrag() {
    isDown = false;
  }

  header.addEventListener('mousedown', startDrag);
  header.addEventListener('touchstart', startDrag);

  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);

  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
}

// Taskbar
function addTask(win) {
  const taskBtn = document.createElement('button');
  taskBtn.textContent = win.querySelector('.window-title').textContent;

  taskBtn.addEventListener('click', () => {
    win.style.display = win.style.display === 'none' ? 'flex' : 'none';
    focusWindow(win);
  });

  tasks.appendChild(taskBtn);
  win.taskBtn = taskBtn;
}

function removeTask(win) {
  if (win.taskBtn) {
    win.taskBtn.remove();
    delete win.taskBtn;
  }
}