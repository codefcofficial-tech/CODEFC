
// ===================================
// CODEFC SUPABASE CONNECTION
// ===================================

const SUPABASE_URL = "https://nooanrlldbgushpflmln.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_awJWAfX4VfQ_lxl1ST0gXw_1NkzbXkH";

const CODEFC_DB = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Make database client available to other CODEFC scripts
window.CODEFC_DB = CODEFC_DB;

console.log("CODEFC Supabase client initialized");


// ===================================
// MOBILE NAVIGATION
// ===================================

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {

  menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("active");

    const isOpen = navigation.classList.contains("active");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  const navigationLinks = navigation.querySelectorAll("a");

  navigationLinks.forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("active");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}


// ===================================
// CODEFC PWA INSTALLATION
// ===================================

let deferredInstallPrompt;

const installButton = document.getElementById("installApp");

if (installButton) {

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    deferredInstallPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;

    deferredInstallPrompt.prompt();

    await deferredInstallPrompt.userChoice;

    deferredInstallPrompt = null;
  });

  window.addEventListener("appinstalled", () => {
    installButton.hidden = true;
  });
}
