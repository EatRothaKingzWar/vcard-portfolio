'use strict';

// ============================================================
// ELEMENT TOGGLE FUNCTION
// ============================================================
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// ============================================================
// SIDEBAR
// ============================================================
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// ============================================================
// TESTIMONIALS MODAL
// ============================================================
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
}

modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// ============================================================
// CUSTOM SELECT (Portfolio Filter)
// ============================================================
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// ============================================================
// CONTACT FORM (Full Stack Integration with Neon PostgreSQL)
// ============================================================

const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// ⚠️ Change this to your deployed backend URL in production
const API_URL = "/api/contact";

// Enable submit button only when form is valid
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// Handle form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Collect form data
  const formData = new FormData(form);
  const payload = {
    fullname: formData.get("fullname")?.trim(),
    email: formData.get("email")?.trim(),
    message: formData.get("message")?.trim()
  };

  // Basic client-side validation
  if (!payload.fullname || !payload.email || !payload.message) {
    showNotification("Please fill in all fields.", "error");
    return;
  }

  // Save original button content
  const originalBtnContent = formBtn.innerHTML;

  // Set loading state
  formBtn.setAttribute("disabled", "");
  formBtn.innerHTML = `
    <ion-icon name="hourglass-outline"></ion-icon>
    <span>Sending...</span>
  `;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showNotification("✅ Message sent! I'll get back to you soon.", "success");
      form.reset();
      formBtn.setAttribute("disabled", "");
    } else {
      showNotification("❌ " + (result.error || "Something went wrong."), "error");
      formBtn.removeAttribute("disabled");
    }
  } catch (error) {
    console.error("Contact form error:", error);
    showNotification("❌ Failed to send. Is the backend server running?", "error");
    formBtn.removeAttribute("disabled");
  } finally {
    // Restore button content
    formBtn.innerHTML = originalBtnContent;
  }
});

// ============================================================
// TOAST NOTIFICATION HELPER
// ============================================================
function showNotification(message, type = "success") {
  // Remove any existing notification
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;

  // Inline styles (so you don't need to touch style.css)
  Object.assign(toast.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "14px 22px",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "500",
    fontSize: "14px",
    zIndex: "9999",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
    opacity: "0",
    transform: "translateY(-10px)",
    maxWidth: "320px",
    background: type === "success" ? "#28a745" : "#dc3545"
  });

  document.body.appendChild(toast);

  // Fade in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  // Fade out & remove
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
  });
}