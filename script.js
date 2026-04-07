let z = 1; // z-index for windows
let history = [];
let historyIndex = -1;

/* Open a window */
function openWindow(type) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.top = "100px";
  win.style.left = "100px";
  win.style.zIndex = z++;

  win.innerHTML = `
    <div class="title-bar" onmousedown="drag(event, this.parentElement)">
      ${type.toUpperCase()}
      <span class="close-btn" onclick="this.parentElement.parentElement.remove()">✖</span>
    </div>
    <div class="content">${getContent(type)}</div>
  `;

  // Bring window to front on click
  win.onclick = () => win.style.zIndex = z++;

  document.getElementById("windows").appendChild(win);

  // Focus input for terminal
  if(type === "terminal") {
    const input = win.querySelector("#command");
    input.focus();
    input.addEventListener("keydown", handleCommand);
  }
}

/* Window content */
function getContent(type) {
  switch(type) {
    case "about":
      return "<h3>About Me</h3><p>Hamza, Developer passionate about AI & Cybersecurity.</p>";
    case "projects":
      return "<h3>Projects</h3><ul><li>Spam Classifier</li><li>Portfolio OS</li></ul>";
    case "certificates":
      return "<h3>Certificates</h3><p>Machine Learning, Web Dev</p>";
    case "contact":
      return "<h3>Contact</h3><p>Email: your@email.com</p>";
    case "terminal":
      return document.getElementById("terminal-template").innerHTML;
    default:
      return "<p>Content not found.</p>";
  }
}

/* Dragging windows */
function drag(e, win) {
  let shiftX = e.clientX - win.offsetLeft;
  let shiftY = e.clientY - win.offsetTop;

  function moveAt(x, y) {
    win.style.left = x - shiftX + 'px';
    win.style.top = y - shiftY + 'px';
  }

  function onMouseMove(e) {
    moveAt(e.pageX, e.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);

  document.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    document.onmouseup = null;
  };
}

/* Terminal command handling */
function handleCommand(e) {
  const input = e.target;
  const output = input.closest(".terminal").querySelector("#output");

  if (e.key === "Enter") {
    let cmd = input.value.trim();
    if (!cmd) return;

    // Save history
    history.push(cmd);
    historyIndex = history.length;

    // Print command
    output.innerHTML += `<p><span class="prompt">hamza@portfolio:~$</span> ${cmd}</p>`;

    // Execute command
    let result = executeCommand(cmd);
    if (result) output.innerHTML += `<p>${result}</p>`;

    input.value = "";
    output.scrollTop = output.scrollHeight;
  }

  // Arrow UP
  if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
  }

  // Arrow DOWN
  if (e.key === "ArrowDown") {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      input.value = "";
    }
  }
}

/* Terminal commands */
function executeCommand(cmd) {
  switch (cmd) {
    case "help":
      return "Commands: help, about, projects, contact, clear, open [window]";
    case "about":
      return "I am Hamza, passionate about AI & Cybersecurity.";
    case "projects":
      return "Spam Classifier | Portfolio OS | Future AI Projects";
    case "contact":
      return "Email: your@email.com";
    case "clear":
      document.querySelectorAll(".terminal #output").forEach(out => out.innerHTML = "");
      return "";
    default:
      if (cmd.startsWith("open ")) {
        let win = cmd.split(" ")[1];
        openWindow(win);
        return `Opening ${win}...`;
      }
      return "Command not found. Type 'help'";
  }
}

/* Clock in taskbar */
function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText =
    now.getHours() + ":" + now.getMinutes().toString().padStart(2,'0');
}

setInterval(updateClock, 1000);
updateClock();