
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

let deferredInstallPrompt = null;

const installButton = document.getElementById("installApp");

function isAppInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches ||
         window.navigator.standalone === true;
}

function updateInstallButton() {
  if (!installButton) return;

  if (isAppInstalled()) {
    installButton.textContent = "APP INSTALLED ✓";
    installButton.disabled = true;
    installButton.classList.add("app-installed");
  } else {
    installButton.textContent = "↓ Install App";
    installButton.disabled = false;
    installButton.classList.remove("app-installed");
  }
}

if (installButton) {

  updateInstallButton();

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    deferredInstallPrompt = event;
    updateInstallButton();
  });

  installButton.addEventListener("click", async () => {

    if (isAppInstalled()) {
      updateInstallButton();
      return;
    }

    if (!deferredInstallPrompt) {
      alert(
        "To install CODEFC:\n\n" +
        "1. Open this website in Google Chrome.\n" +
        "2. Tap the three dots at the top right.\n" +
        "3. Select Install app or Add to Home screen."
      );
      return;
    }

    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;

    try {
      await promptEvent.prompt();

      const result = await promptEvent.userChoice;

      if (result.outcome === "accepted") {
        installButton.textContent = "INSTALLING...";
      } else {
        updateInstallButton();
      }

    } catch (error) {
      console.error("CODEFC installation error:", error);
      updateInstallButton();
    }
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;

    installButton.textContent = "APP INSTALLED ✓";
    installButton.disabled = true;
    installButton.classList.add("app-installed");
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
    emailRedirectTo: "https://codefcofficial-tech.github.io/CODEFC/",
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

// ===================================
// CODEFC USER LOGIN
// ===================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const loginMessage = document.getElementById("loginMessage");
  const loginButton = document.getElementById("loginButton");

  // Show or hide password
  const showPassword = document.getElementById("showPassword");

  if (showPassword) {
    showPassword.addEventListener("click", () => {
      const passwordInput = document.getElementById("loginPassword");

      const showing = passwordInput.type === "text";

      passwordInput.type = showing ? "password" : "text";
      showPassword.textContent = showing ? "Show" : "Hide";
    });
  }

  // Sign in
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";
    loginMessage.textContent = "";

    try {
      const { data, error } =
        await window.CODEFC_DB.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      if (!data.session) {
        throw new Error("Sign in could not be completed.");
      }

      loginMessage.style.color = "#39ff14";
      loginMessage.textContent = "Login successful! Opening dashboard...";

      window.location.href = "dashboard.html";

    } catch (error) {
      loginMessage.style.color = "#ff7777";
      loginMessage.textContent = error.message;

    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Sign In";
    }
  });

  // Password recovery
  const forgotPassword = document.getElementById("forgotPassword");

  if (forgotPassword) {
    forgotPassword.addEventListener("click", async (event) => {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();

      if (!email) {
        loginMessage.style.color = "#ff7777";
        loginMessage.textContent = "Enter your email address first.";
        return;
      }

      try {
        const { error } =
          await window.CODEFC_DB.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin +
              window.location.pathname.replace(
                "login.html",
                "reset-password.html"
              )
          });

        if (error) throw error;

        loginMessage.style.color = "#39ff14";
        loginMessage.textContent =
          "If the account exists, a password reset email will be sent.";

      } catch (error) {
        loginMessage.style.color = "#ff7777";
        loginMessage.textContent = error.message;
      }
    });
  }
}
