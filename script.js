/* =========================================================
   VERTEX CLUB — script.js
   This single file powers BOTH the signup page and the
   dashboard page. It checks which elements exist on the
   current page and only runs the matching code.
   ========================================================= */

/* ---------------------------------------------------------
   SHARED HELPERS (used by both signup and dashboard)
   --------------------------------------------------------- */

// The key we use to store our list of applicants in localStorage.
const STORAGE_KEY = "clubApplicants";

// Read the array of applicants from localStorage.
// localStorage only stores strings, so we use JSON.parse()
// to turn the saved string back into a real JavaScript array.
function getApplicants() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return []; // No applicants saved yet.
  }
  return JSON.parse(stored);
}

// Save the array of applicants back to localStorage.
// JSON.stringify() turns our JavaScript array into a string,
// because localStorage can only hold strings.
function saveApplicants(applicants) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applicants));
}

// Small helper to toggle the mobile nav menu (used on every page).
function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
  }
}
setupMobileNav();

/* ---------------------------------------------------------
   SIGNUP PAGE LOGIC
   Only runs if the signup form exists on this page.
   --------------------------------------------------------- */

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  // Grab the input fields and the elements we show errors in.
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  const successMessage = document.getElementById("successMessage");

  const MIN_USERNAME_LENGTH = 3;
  const MIN_PASSWORD_LENGTH = 8;

  // --- Validation functions ---
  // Each function returns an error message string, or an
  // empty string "" if that field is valid.

  function validateUsername(value) {
    const trimmed = value.trim();
    if (trimmed === "") {
      return "Please enter your username or full name.";
    }
    if (trimmed.length < MIN_USERNAME_LENGTH) {
      return `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`;
    }
    return "";
  }

  function validateEmail(value) {
    const trimmed = value.trim();
    if (trimmed === "") {
      return "Please enter your email address.";
    }
    // A standard, practical email-format check.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      return "Please enter a valid email address (e.g. name@example.com).";
    }
    return "";
  }

  function validatePassword(value) {
    if (value === "") {
      return "Please enter a password.";
    }
    if (value.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    }
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return "Password needs at least one uppercase letter, one lowercase letter, and one number.";
    }
    return "";
  }

  // Shows/hides an error message under a field and toggles
  // the "invalid" red-border style on the input.
  function showFieldError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    if (message) {
      inputEl.classList.add("invalid");
    } else {
      inputEl.classList.remove("invalid");
    }
  }

  // Validate a single field as the user types (nice UX),
  // so people see feedback before they even hit submit.
  usernameInput.addEventListener("input", () => {
    showFieldError(usernameInput, usernameError, validateUsername(usernameInput.value));
  });

  emailInput.addEventListener("input", () => {
    showFieldError(emailInput, emailError, validateEmail(emailInput.value));
  });

  passwordInput.addEventListener("input", () => {
    showFieldError(passwordInput, passwordError, validatePassword(passwordInput.value));
  });

  // --- Form submission ---
  signupForm.addEventListener("submit", function (event) {
    // Stop the browser's default "reload the page" behavior.
    event.preventDefault();

    const usernameValue = usernameInput.value;
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;

    // Run all three validations.
    const usernameMsg = validateUsername(usernameValue);
    const emailMsg = validateEmail(emailValue);
    const passwordMsg = validatePassword(passwordValue);

    // Show any errors that exist.
    showFieldError(usernameInput, usernameError, usernameMsg);
    showFieldError(emailInput, emailError, emailMsg);
    showFieldError(passwordInput, passwordError, passwordMsg);

    // If any field has an error message, stop here —
    // do NOT submit / save the form.
    if (usernameMsg || emailMsg || passwordMsg) {
      successMessage.classList.remove("show");
      return;
    }

    // Check if this email is already registered, so we don't
    // create duplicate applicants with the same email.
    const applicants = getApplicants();
    const alreadyExists = applicants.some(
      (applicant) => applicant.email.toLowerCase() === emailValue.trim().toLowerCase()
    );

    if (alreadyExists) {
      showFieldError(emailInput, emailError, "This email is already registered.");
      return;
    }

    // Build the new applicant object.
    // NOTE: In a real application you must NEVER store plain-text
    // passwords. This is done here only to demonstrate localStorage
    // for a student project — a real backend would hash passwords.
    const newApplicant = {
      username: usernameValue.trim(),
      email: emailValue.trim(),
      password: passwordValue,
    };

    // Add the new applicant to the existing list (without
    // overwriting anyone already stored) and save it back.
    applicants.push(newApplicant);
    saveApplicants(applicants);

    // Show the success message and reset the form.
    successMessage.classList.add("show");
    signupForm.reset();

    // Clear any leftover red borders / error text.
    showFieldError(usernameInput, usernameError, "");
    showFieldError(emailInput, emailError, "");
    showFieldError(passwordInput, passwordError, "");
  });
}

/* ---------------------------------------------------------
   DASHBOARD PAGE LOGIC
   Only runs if the applicants table exists on this page.
   --------------------------------------------------------- */

const applicantsTableBody = document.getElementById("applicantsTableBody");

if (applicantsTableBody) {
  const emptyState = document.getElementById("emptyState");
  const tableCard = document.getElementById("tableCard");
  const applicantCount = document.getElementById("applicantCount");

  // Draws (or redraws) the whole table based on what is
  // currently saved in localStorage.
  function renderApplicants() {
    const applicants = getApplicants();

    // Update the small "X applicants" counter badge.
    applicantCount.textContent =
      applicants.length === 1 ? "1 applicant registered" : `${applicants.length} applicants registered`;

    // If there are no applicants, hide the table and show
    // a friendly empty-state message instead.
    if (applicants.length === 0) {
      tableCard.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    tableCard.style.display = "block";
    emptyState.style.display = "none";

    // Clear out any existing rows before redrawing.
    applicantsTableBody.innerHTML = "";

    // Build one table row per applicant.
    applicants.forEach((applicant, index) => {
      const row = document.createElement("tr");

      // The data-label attributes let our CSS show these
      // labels on small/mobile screens (see style.css).
      row.innerHTML = `
        <td data-label="S.No">${index + 1}</td>
        <td data-label="Username">${escapeHtml(applicant.username)}</td>
        <td data-label="Email">${escapeHtml(applicant.email)}</td>
        <td data-label="Action">
          <button class="btn-delete" data-index="${index}">Delete</button>
        </td>
      `;

      applicantsTableBody.appendChild(row);
    });

    // Attach a click listener to every delete button we just created.
    document.querySelectorAll(".btn-delete").forEach((button) => {
      button.addEventListener("click", handleDeleteClick);
    });
  }

  // Runs when a Delete button is clicked.
  function handleDeleteClick(event) {
    const indexToDelete = Number(event.target.getAttribute("data-index"));
    const applicants = getApplicants();
    const applicant = applicants[indexToDelete];

    // Always confirm before deleting, so a misclick doesn't
    // remove someone's registration by accident.
    const confirmed = window.confirm(
      `Remove ${applicant.username} (${applicant.email}) from the applicant list?`
    );

    if (!confirmed) {
      return; // User clicked "Cancel" — do nothing.
    }

    // Remove just that one applicant, leaving everyone else untouched.
    applicants.splice(indexToDelete, 1);
    saveApplicants(applicants);

    // Redraw the table immediately so the change is visible.
    renderApplicants();
  }

  // Basic escaping so a username/email can't inject stray HTML
  // into the page when we render it with innerHTML above.
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Render the table as soon as the dashboard page loads,
  // and also whenever the page is refreshed (this code runs
  // fresh on every page load, so it's automatic).
  renderApplicants();
}
