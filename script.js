
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
