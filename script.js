
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
// ===================================
// CODEFC USER REGISTRATION
// ===================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const message = document.getElementById("signupMessage");
    const submitButton = signupForm.querySelector('button[type="submit"]');

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      return;
    }

    if (password.length < 8) {
      message.textContent = "Password must contain at least 8 characters.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Creating account...";
    message.textContent = "";

    try {
      const { data, error } = await window.CODEFC_DB.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) throw error;

      if (data.session) {
        message.textContent = "Account created successfully! Redirecting...";

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);

      } else {
        message.textContent =
          "Account created! Please check your email to verify your account before signing in.";

        signupForm.reset();
      }

    } catch (error) {
      message.textContent = error.message;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Create Account";
    }
  });
  }
