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

// 3. SMART Outfit Suggestion with Day & Reason
document.getElementById('suggestBtn').addEventListener('click', () => {
  const result = document.getElementById('outfitResult');
  
  // Get current day
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  
  // Day-specific suggestions
  const dayInfo = {
    'Monday': {
      special: 'Start of the work week! Fresh energy needed.',
      occasion: 'Office/College',
      vibe: 'Professional & Energetic',
      tip: 'People wear crisp shirts on Mondays to make a strong first impression of the week.'
    },
    'Tuesday': {
      special: 'Productivity day! Time to get things done.',
      occasion: 'Work/Study Focus',
      vibe: 'Comfortable & Focused',
      tip: 'Comfortable clothes help you stay focused on tasks without distractions.'
    },
    'Wednesday': {
      special: 'Mid-week hump day! Halfway there.',
      occasion: 'Balanced Day',
      vibe: 'Smart Casual',
      tip: 'Wednesday calls for a balanced look - not too formal, not too casual.'
    },
    'Thursday': {
      special: 'Almost weekend! Pre-weekend energy.',
      occasion: 'Work/Social',
      vibe: 'Stylish & Confident',
      tip: 'Thursday is great for trying slightly bolder fashion choices before the weekend.'
    },
    'Friday': {
      special: 'TGIF! Weekend vibes starting.',
      occasion: 'Casual Friday/Party',
      vibe: 'Relaxed & Fun',
      tip: 'Casual Fridays are perfect for jeans and comfortable tees. Evening plans? Dress up!'
    },
    'Saturday': {
      special: 'Weekend! Freedom to express yourself.',
      occasion: 'Leisure/Party/Shopping',
      vibe: 'Trendy & Relaxed',
      tip: 'Saturdays are perfect for that favorite shirt! People dress up to enjoy the day, meet friends, or go out.'
    },
    'Sunday': {
      special: 'Relaxation & Family day.',
      occasion: 'Rest/Family/Brunch',
      vibe: 'Comfortable & Casual',
      tip: 'Sundays are for comfort! Easy clothes for family time, brunch, or just relaxing.'
    }
  };

  const info = dayInfo[today];
  const tops = items.filter(i => i.category === 'shirt' || i.category === 'tshirt');
  const bottoms = items.filter(i => i.category === 'pants' || i.category === 'jeans');
  const shoes = items.filter(i => i.category === 'shoes');

  if (tops.length > 0 && bottoms.length > 0) {
    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    
    let html = `<div class="suggestion">`;
    html += `<h3>📅 Today is ${today}</h3>`;
    html += `<p><strong>✨ Why Special:</strong> ${info.special}</p>`;
    html += `<p><strong>🎯 Occasion:</strong> ${info.occasion}</p>`;
    html += `<p><strong>💫 Vibe:</strong> ${info.vibe}</p>`;
    html += `<hr style="margin: 10px 0; border: none; border-top: 1px solid #e5e7eb;">`;
    html += `<p><strong>👔 Today's Outfit:</strong></p>`;
    html += `<p>Top: <strong>${randomTop.name}</strong></p>`;
    html += `<p>Bottom: <strong>${randomBottom.name}</strong></p>`;
    
    if (shoes.length > 0) {
      const randomShoes = shoes[Math.floor(Math.random() * shoes.length)];
      html += `<p>Shoes: <strong>${randomShoes.name}</strong></p>`;
    }
    
    html += `<p style="margin-top: 10px; font-style: italic; color: #6b7280;"> <strong>Why this works:</strong> ${info.tip}</p>`;
    html += `<p style="margin-top: 8px; font-size: 12px; color: #10b981;">✅ Many people wear similar outfits on ${today}s because it matches the day's energy!</p>`;
    html += `</div>`;
    
    result.innerHTML = html;
  } else {
    result.innerHTML = `<div class="suggestion"><h3>📅 Today is ${today}</h3><p><strong>${info.special}</strong></p><p style="color: #ef4444; margin-top: 10px;">Please add at least one Top (Shirt/T-shirt) and one Bottom (Pants/Jeans) to your wardrobe!</p></div>`;
  }
});

// 4. Basic AI Stylist
document.getElementById('askBtn').addEventListener('click', () => {
  const q = document.getElementById('stylistQuestion').value.toLowerCase();
  const ans = document.getElementById('stylistAnswer');
  
  if (q.includes('interview')) {
    ans.textContent = "For an interview, wear a crisp shirt, formal trousers, and clean shoes. Keep it simple and professional!";
  } else if (q.includes('party')) {
    ans.textContent = "For a party, try a stylish t-shirt or casual shirt with dark jeans and nice sneakers.";
  } else if (q.includes('college')) {
    ans.textContent = "For college, a comfortable t-shirt, jeans, and sneakers are perfect.";
  } else {
    ans.textContent = "I'm learning! For now, try wearing what makes you feel confident. Real AI coming soon!";
  }
});
