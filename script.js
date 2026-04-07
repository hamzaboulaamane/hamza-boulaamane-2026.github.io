const desktop = document.getElementById('desktop');
const windowsContainer = document.getElementById('windows');
const terminalTemplate = document.getElementById('terminal-template');
const tasks = document.getElementById('tasks');

// Clock
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  document.getElementById('clock').textContent = time;
}
setInterval(updateClock, 1000);
updateClock();

// Open Window
desktop.querySelectorAll('.icon[data-window]').forEach(icon => {
  icon.addEventListener('dblclick', () => openWindow(icon.dataset.window));
});

function openWindow(type) {
  let win = terminalTemplate.content.cloneNode(true).querySelector('.window');
  
  if(type !== 'terminal') {
    win.querySelector('.window-title').textContent = type.charAt(0).toUpperCase() + type.slice(1);
    win.querySelector('.output').innerHTML = `<p>${type} content goes here.</p>`;
  }
  
  windowsContainer.appendChild(win);
  makeDraggable(win);
  addTask(win);
  
  // Close button
  win.querySelector('.close').addEventListener('click', () => {
    removeTask(win);
    win.remove();
  });

  // Terminal command input
  const input = win.querySelector('.command-input');
  if(input) {
    input.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') {
        const output = win.querySelector('.output');
        const cmd = input.value.trim();
        handleCommand(cmd, output);
        input.value = '';
      }
    });
  }
}

// Terminal Commands
function handleCommand(cmd, output) {
  let result = '';
  switch(cmd.toLowerCase()) {
    case 'help':
      result = 'Available commands: help, about, projects, clear';
      break;
    case 'about':
      result = 'Hi, I am Hamza. Welcome to HamzaOS!';
      break;
    case 'projects':
      result = 'Projects: Web Portfolio, AI Classifier, etc.';
      break;
    case 'clear':
      output.innerHTML = '';
      return;
    default:
      result = `Command not found: ${cmd}`;
  }
  output.innerHTML += `<p>${result}</p>`;
  output.scrollTop = output.scrollHeight;
}

// Draggable Windows
function makeDraggable(win) {
  const header = win.querySelector('.window-header');
  let offsetX = 0, offsetY = 0, isDown = false;

  header.addEventListener('mousedown', (e) => {
    isDown = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = Date.now();
  });

  document.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    win.style.left = e.clientX - offsetX + 'px';
    win.style.top = e.clientY - offsetY + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
  });
}

// Taskbar
function addTask(win) {
  const taskBtn = document.createElement('button');
  taskBtn.textContent = win.querySelector('.window-title').textContent;
  taskBtn.onclick = () => {
    if(win.style.display === 'none') win.style.display = 'flex';
    else win.style.display = 'none';
  }
  tasks.appendChild(taskBtn);

  // Store the actual element, not a string
  win._taskBtn = taskBtn;
}

function removeTask(win) {
  if(win._taskBtn) {
    win._taskBtn.remove();
    delete win._taskBtn; // optional, clean up reference
  }
}