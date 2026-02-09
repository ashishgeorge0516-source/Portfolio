import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCrMT8y_O6pvI_LWNiRKQy_5CoU36Fnjig",
    authDomain: "portfolio-cf53e.firebaseapp.com",
    projectId: "portfolio-cf53e",
    storageBucket: "portfolio-cf53e.firebasestorage.app",
    messagingSenderId: "257623996950",
    appId: "1:257623996950:web:07a97b41a7b72064c7d337",
    measurementId: "G-1WM83PGWEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

/* Student Portfolio Script */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       Navigation & Mobile Menu
       ========================================= */
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    // Toggle Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close Mobile Menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    /* =========================================
       Code Viewer Logic
       ========================================= */

    // Mock Data for Projects
    const projectCode = {
        wordle: `
// Wordle Clone Game Logic
const words = ["APPLE", "BEACH", "BRAIN", "BREAD", "BRUSH"];
let secretWord = words[Math.floor(Math.random() * words.length)];
let attempts = 0;

function checkGuess(guess) {
    if (guess === secretWord) {
        return "Correct! You Win!";
    }
    
    let feedback = "";
    for (let i = 0; i < 5; i++) {
        if (guess[i] === secretWord[i]) {
            feedback += "🟩"; // Correct position
        } else if (secretWord.includes(guess[i])) {
            feedback += "🟨"; // Wrong position
        } else {
            feedback += "⬜"; // Not in word
        }
    }
    attempts++;
    return feedback;
}`,
        portfolio: `
/* Portfolio Navbar CSS */
.navbar {
    position: sticky;
    top: 0;
    background-color: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
    z-index: 1000;
}

.nav-links a:hover {
    color: var(--primary-color);
    transition: color 0.3s ease;
}

/* Responsive Handler */
@media (max-width: 768px) {
    .nav-links {
        display: none;
        flex-direction: column;
        width: 100%;
    }
    
    .nav-links.active {
        display: flex;
    }
}`,
        movie: `
// Movie Discovery App - Fetch API
const API_KEY = "your_api_key_here";
const BASE_URL = "https://api.themoviedb.org/3";

async function searchMovies(query) {
    try {
        const response = await fetch(\`\${BASE_URL}/search/movie?api_key=\${API_KEY}&query=\${query}\`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function displayMovies(movies) {
    const container = document.getElementById('movie-grid');
    container.innerHTML = "";
    
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = "movie-card";
        card.innerHTML = \`
            <img src="https://image.tmdb.org/t/p/w500\${movie.poster_path}" alt="\${movie.title}">
            <h3>\${movie.title}</h3>
            <p>Rating: \${movie.vote_average}</p>
        \`;
        container.appendChild(card);
    });
}`
    };

    const modal = document.getElementById('code-viewer-modal');
    const modalCode = document.getElementById('modal-code');
    const closeModal = document.querySelector('.close-modal');
    const viewCodeBtns = document.querySelectorAll('.view-code-btn');

    // Open Modal
    function openModal(projectId) {
        modal.style.display = 'flex';
        // Small delay to allow display:flex to apply before adding active class for transition
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        const code = projectCode[projectId] || "// No code available for this project.";
        modalCode.textContent = code;

        // Trigger Prism Highlight
        Prism.highlightElement(modalCode);

        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('project', projectId);
        window.history.pushState({}, '', url);
    }

    // Close Modal
    function closeViewer() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match transition duration

        // Remove from URL
        const url = new URL(window.location);
        url.searchParams.delete('project');
        window.history.pushState({}, '', url);
    }

    viewCodeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });

    closeModal.addEventListener('click', closeViewer);

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeViewer();
        }
    });

    // Check URL on load
    const urlParams = new URLSearchParams(window.location.search);
    const initialProject = urlParams.get('project');
    if (initialProject && projectCode[initialProject]) {
        openModal(initialProject);
    }

    /* =========================================
       Contact Form Logic (Firebase Integration)
       ========================================= */
    const contactForm = document.getElementById('contact-form');
    const formMsg = document.getElementById('form-msg');
    const submitBtn = document.getElementById('submit-btn');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formMsg.textContent = '';
        formMsg.className = 'form-msg';

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Save to Firestore collection 'portfolio1'
        try {
            await addDoc(collection(db, "portfolio1"), {
                ...data,
                timestamp: new Date()
            });

            formMsg.textContent = 'Message sent successfully!';
            formMsg.classList.add('success');
            contactForm.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            // Show error message
            formMsg.textContent = 'Error sending message. Please try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });

});
