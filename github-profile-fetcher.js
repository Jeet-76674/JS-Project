const searchForm = document.getElementById('searchForm');
const usernameInput = document.getElementById('usernameInput');
const message = document.getElementById('message');
const profileCard = document.getElementById('profileCard');
const themeToggle = document.getElementById('themeToggle');
const suggestionButtons = document.querySelectorAll('.suggestion-btn');

const avatar = document.getElementById('avatar');
const nameField = document.getElementById('name');
const bio = document.getElementById('bio');
const repos = document.getElementById('repos');
const followers = document.getElementById('followers');
const following = document.getElementById('following');
const locationField = document.getElementById('location');
const profileLink = document.getElementById('profileLink');

// Display error/success messages in a reusable Bootstrap alert
function showMessage(text, type = 'danger') {
  message.textContent = text;
  message.className = `alert alert-${type} mb-4`;
  message.classList.remove('d-none');
}

// Hide the message area when we don't need to show anything
function hideMessage() {
  message.classList.add('d-none');
}

// Put API data into the profile card fields
function renderProfile(user) {
  avatar.src = user.avatar_url;
  nameField.textContent = user.name || user.login;
  bio.textContent = user.bio || 'No bio available.';
  repos.textContent = user.public_repos;
  followers.textContent = user.followers;
  following.textContent = user.following;
  locationField.textContent = user.location || 'Not provided';
  locationField.title = user.location || 'Not provided';
  profileLink.href = user.html_url;

  profileCard.classList.remove('d-none');
}

// Fetch user profile from GitHub API using a simple async function
async function fetchProfile(username) {
  hideMessage();
  profileCard.classList.add('d-none');

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    // If GitHub returns a non-success response, show a friendly message
    if (!response.ok) {
        throw new Error('User not found. Try another username.');
    }
    
    const user = await response.json();
    console.log(user);
    renderProfile(user);
  } catch (error) {
    showMessage(error.message);
  }
}

// Handle form submit and prevent page reload
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();

  // Basic empty input validation
  if (!username) {
    showMessage('Please enter a GitHub username.');
    return;
  }

  fetchProfile(username);
});

// Let user quickly search from predefined profile buttons
suggestionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const username = button.dataset.username;
    usernameInput.value = username;
    fetchProfile(username);
  });
});

// Toggle between dark and light mode and update button text
themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-bs-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-bs-theme', nextTheme);
  themeToggle.textContent = nextTheme === 'dark' ? '🌙 Dark' : '☀️ Light';
});
