
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

// Open and close mobile navigation
menuToggle.addEventListener("click", () => {
  navigation.classList.toggle("active");

  const isOpen = navigation.classList.contains("active");

  menuToggle.textContent = isOpen ? "✕" : "☰";
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Close navigation after selecting a link
const navigationLinks = navigation.querySelectorAll("a");

navigationLinks.forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("active");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
  });
});
// CODEFC PWA INSTALLATION

let deferredInstallPrompt;

const installButton = document.getElementById("installApp");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();

  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;

  deferredInstallPrompt.prompt();

  const result = await deferredInstallPrompt.userChoice;

  if (result.outcome === "accepted") {
    installButton.hidden = true;
  }

  deferredInstallPrompt = null;
});

window.addEventListener("appinstalled", () => {
  installButton.hidden = true;
});
