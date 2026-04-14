const desktop = document.getElementById('desktop');
const windowsContainer = document.getElementById('windows');
const tasks = document.getElementById('tasks');

// ✅ Templates mapping (IMPORTANT)
const templates = {
  terminal: 'terminal-template',
  cv: 'cv-template',
  education: 'education-template',
  about: 'about-template',
  projects: 'projects-template',
  certificates: 'certificates-template',
  contact: 'contact-template'
};

// 🌐 External links (like X)
const externalLinks = {
  x: 'https://twitter.com/YOUR_USERNAME'
};

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// 🖱️ Desktop icon click (UPDATED ✅)
desktop.querySelectorAll('.icon').forEach(icon => {

  const open = () => {
    const type = icon.dataset.window;

    if (externalLinks[type]) {
      window.open(externalLinks[type], '_blank');
      return;
    }

    openWindow(type);
  };

  // Double click (OS style)
  icon.addEventListener('dblclick', open);

  // Single click (modern UX)
  icon.addEventListener('click', open);

  // Keyboard accessibility
  icon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
});

// 🪟 Open Window (MODERN VERSION)
function openWindow(type) {
  const templateId = templates[type];

  if (!templateId) return;

  const template = document.getElementById(templateId);
  const win = template.content.cloneNode(true).querySelector('.window');

  windowsContainer.appendChild(win);

  makeDraggable(win);
  addTask(win);

  // Close button
  win.querySelector('.close').addEventListener('click', () => {
    removeTask(win);
    win.remove();
  });

  // Terminal logic ONLY
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
}

// 💻 Terminal commands
function handleCommand(cmd, output) {
  let result = '';

  switch (cmd.toLowerCase()) {
    case 'help':
      result = 'Available commands: help, about, projects, cv, education, clear';
      break;

    case 'about':
      result = 'Hi, I am Hamza. Welcome to HamzaOS!';
      break;

    case 'projects':
      result = 'Projects: Web Portfolio, AI Classifier, etc.';
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

// 🧲 Drag windows
function makeDraggable(win) {
  const header = win.querySelector('.window-header');
  let isDown = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener('mousedown', (e) => {
    isDown = true;

    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    win.style.zIndex = Date.now();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return;

    win.style.left = e.clientX - offsetX + 'px';
    win.style.top = e.clientY - offsetY + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
  });
}

// 📌 Taskbar
function addTask(win) {
  const taskBtn = document.createElement('button');
  taskBtn.textContent = win.querySelector('.window-title').textContent;

  taskBtn.addEventListener('click', () => {
    win.style.display = win.style.display === 'none' ? 'flex' : 'none';
    win.style.zIndex = Date.now();
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