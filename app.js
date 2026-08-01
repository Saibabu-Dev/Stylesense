// 1. Tab Switching Logic
const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.tab');

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// 2. Wardrobe Logic
let items = JSON.parse(localStorage.getItem('stylesense_items') || '[]');
const itemForm = document.getElementById('itemForm');
const wardrobeList = document.getElementById('wardrobeList');

renderWardrobe();

itemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('itemName').value.trim();
  const category = document.getElementById('itemCategory').value;

  if (!name || !category) return;

  const item = { id: Date.now(), name, category };
  items.push(item);
  localStorage.setItem('stylesense_items', JSON.stringify(items));
  
  itemForm.reset();
  renderWardrobe();
});

function renderWardrobe() {
  if (items.length === 0) {
    wardrobeList.innerHTML = '<p>No items yet. Add your first item!</p>';
    return;
  }
  wardrobeList.innerHTML = items.map(item => `
    <div class="item">
      <div class="item-info">
        <strong>${item.name}</strong>
        <span>${item.category}</span>
      </div>
      <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
    </div>
  `).join('');
}

window.deleteItem = function(id) {
  items = items.filter(i => i.id !== id);
  localStorage.setItem('stylesense_items', JSON.stringify(items));
  renderWardrobe();
};

// ==========================================
// 3. REAL GEMINI AI INTEGRATION
// ==========================================

// ⚠️ IMPORTANT: PASTE YOUR API KEY INSIDE THE QUOTES BELOW
const GEMINI_API_KEY = "AQ.Ab8RN6IJqikQo2BZlNmWQdql6oFxMZecXl90qAqO1CuRZLpItQ"; 

// Helper function to call Gemini AI
async function callGeminiAI(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    return "AI Error: Please check your API key or internet connection.";
  }
}

// SMART Outfit Suggestion with AI
document.getElementById('suggestBtn').addEventListener('click', async () => {
  const result = document.getElementById('outfitResult');
  result.innerHTML = '<p>🤖 AI is thinking... Please wait...</p>';

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  // Create a list of user's clothes
  const myClothes = items.map(i => `${i.name} (${i.category})`).join(', ');
  const clothesList = myClothes || "No clothes in wardrobe";

  // Create the prompt for AI
  const prompt = `
    Today is ${today}. 
    My wardrobe has these items: ${clothesList}. 
    Please suggest the best outfit for today from my wardrobe. 
    Tell me why it's a good choice for ${today} and what vibe it gives. 
    Format the response clearly with emojis.
  `;

  // Get AI response
  const aiResponse = await callGeminiAI(prompt);
  
  // Display AI response
  result.innerHTML = `<div class="suggestion"><h3>📅 Today is ${today}</h3><p style="white-space: pre-wrap;">${aiResponse}</p></div>`;
});

// REAL AI Stylist Chat
document.getElementById('askBtn').addEventListener('click', async () => {
  const q = document.getElementById('stylistQuestion').value.trim();
  const ans = document.getElementById('stylistAnswer');
  
  if (!q) {
    ans.textContent = "Please type a question first!";
    return;
  }

  ans.textContent = "🤖 AI is thinking...";

  const myClothes = items.map(i => `${i.name} (${i.category})`).join(', ');
  
  const prompt = `
    You are StyleSense, an expert AI fashion stylist.
    My wardrobe has: ${myClothes || "nothing"}.
    User Question: "${q}"
    Please give a helpful, stylish, and confident answer.
  `;

  const aiResponse = await callGeminiAI(prompt);
  ans.textContent = aiResponse;
});
