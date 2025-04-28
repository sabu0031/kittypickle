// Array to store memories
let memories = [];

// Load memories from localStorage and set date input max attribute on page load
document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('memories');
    if (stored) {
        memories = JSON.parse(stored);
    }
    renderMemories();

    // Set max date to today to prevent future dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('memory-date').setAttribute('max', today);
});

// Function to generate a unique ID
function generateId() {
    return 'memory-' + Math.random().toString(36).substr(2, 9);
}

// Function to convert image file to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Function to add or update a memory
async function addMemory() {
    const title = document.getElementById('memory-title').value;
    const desc = document.getElementById('memory-desc').value;
    const date = document.getElementById('memory-date').value;
    const imageInput = document.getElementById('memory-image');
    const memoryId = document.getElementById('memory-id').value;

    // Validate inputs
    if (!title || !desc || !date) {
        alert('Please fill in all fields!');
        return;
    }

    // Validate date is not in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
    if (selectedDate > today) {
        alert('You cannot select a future date!');
        return;
    }

    let imageBase64 = '';
    if (imageInput.files && imageInput.files[0]) {
        // Validate image size (e.g., max 1MB)
        const maxSize = 1 * 1024 * 1024; // 1MB in bytes
        if (imageInput.files[0].size > maxSize) {
            alert('Image size must be less than 1MB!');
            return;
        }
        try {
            imageBase64 = await fileToBase64(imageInput.files[0]);
        } catch (error) {
            alert('Error processing image. Please try again.');
            console.error(error);
            return;
        }
    }

    if (memoryId) {
        // Update existing memory
        const memoryIndex = memories.findIndex(m => m.id === memoryId);
        if (memoryIndex !== -1) {
            memories[memoryIndex] = {
                id: memoryId,
                title,
                desc,
                date,
                image: imageBase64 || memories[memoryIndex].image
            };
        }
    } else {
        // Add new memory
        const memory = {
            id: generateId(),
            title,
            desc,
            date,
            image: imageBase64
        };
        memories.push(memory);
    }

    // Save to localStorage
    try {
        saveMemories();
    } catch (error) {
        alert('Error saving memory. LocalStorage may be full. Try removing some memories.');
        console.error(error);
        return;
    }

    // Reset form
    resetForm();
    // Render memories
    renderMemories();
}

// Function to reset the form
function resetForm() {
    document.getElementById('memory-title').value = '';
    document.getElementById('memory-desc').value = '';
    document.getElementById('memory-date').value = '';
    document.getElementById('memory-image').value = '';
    document.getElementById('memory-id').value = '';
    document.getElementById('memory-submit').textContent = 'post memory';
}

// Function to render memories
function renderMemories() {
    const container = document.getElementById('memories-container');
    container.innerHTML = '';

    memories.forEach(memory => {
        const memoryCard = document.createElement('div');
        memoryCard.className = 'memory-card';
        memoryCard.setAttribute('data-id', memory.id);

        memoryCard.innerHTML = `
            ${memory.image ? `<img src="${memory.image}" alt="${memory.title}">` : ''}
            <div class="memory-content">
                <h4>${memory.title}</h4>
                <p>${memory.desc}</p>
                <button class="edit-button" onclick="editMemory('${memory.id}')">Edit</button>
                <button class="delete-button" onclick="deleteMemory('${memory.id}')">Delete</button>
            </div>
            <span class="date-tag">${memory.date}</span>
        `;

        container.appendChild(memoryCard);
    });
}

// Function to edit a memory
function editMemory(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
        // Populate form with memory data
        document.getElementById('memory-title').value = memory.title;
        document.getElementById('memory-desc').value = memory.desc;
        document.getElementById('memory-date').value = memory.date;
        document.getElementById('memory-id').value = memory.id;
        document.getElementById('memory-submit').textContent = 'update memory';
        // Note: Cannot prefill file input for security reasons
    }
}

// Function to delete a memory
function deleteMemory(memoryId) {
    if (confirm('Are you sure you want to delete this memory?')) {
        memories = memories.filter(m => m.id !== memoryId);
        saveMemories();
        renderMemories();
    }
}

// Function to save memories to localStorage
function saveMemories() {
    // Store the entire memories array, including Base64 image strings
    localStorage.setItem('memories', JSON.stringify(memories));
}

// Tab switching logic
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and tabs
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

        // Add active class to clicked button and corresponding tab
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Timer functionality
document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    let seconds = 0;

    function updateTimer() {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Update timer every second
    setInterval(updateTimer, 1000);
});

// Placeholder for addMemory function (replace with your actual implementation)
function addMemory() {
    console.log('addMemory function called');
    // Add your memory submission logic here
}