const commandInput = document.getElementById("command");
const output = document.getElementById("output");

commandInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const cmd = commandInput.value.toLowerCase();
    output.innerHTML += `<p><span class="prompt">hamza@portfolio:~$</span> ${cmd}</p>`;
    handleCommand(cmd);
    commandInput.value = "";
    output.scrollTop = output.scrollHeight;
  }
});

function handleCommand(cmd) {
  switch (cmd) {
    case "help":
      print(`
Available commands:
about | skills | projects | education | contact | clear
`);
      break;

    case "about":
      print("I’m Hamza, a computer science student passionate about AI & cybersecurity.");
      break;

    case "skills":
      print("Python, C, HTML, CSS, JavaScript, Linux, Networking, ML basics");
      break;

    case "projects":
      print("• Spam email classifier\n• Portfolio website\n• Natural products app");
      break;

    case "education":
      print("BSc Computer Science & Mathematical Sciences");
      break;

    case "contact":
      print("Email: your@email.com\nGitHub: github.com/yourname");
      break;

    case "clear":
      output.innerHTML = "";
      break;

    default:
      print(`Command not found: ${cmd}`);
  }
}

function print(text) {
  text.split("\n").forEach(line => {
    output.innerHTML += `<p>${line}</p>`;
  });
}
