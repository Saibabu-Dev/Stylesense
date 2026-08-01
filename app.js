// 1. Tab Switching Logic (Home, Wardrobe, Outfit, Stylist tabs marchadaniki)
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

                    // 2. Wardrobe Logic (Clothes add cheyadaniki & save cheyadaniki)
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

                                                                                                        // 3. Basic Outfit Suggestion (Simple logic for now)
                                                                                                        document.getElementById('suggestBtn').addEventListener('click', () => {
                                                                                                          const result = document.getElementById('outfitResult');
                                                                                                            const tops = items.filter(i => i.category === 'shirt' || i.category === 'tshirt');
                                                                                                              const bottoms = items.filter(i => i.category === 'pants' || i.category === 'jeans');

                                                                                                                if (tops.length > 0 && bottoms.length > 0) {
                                                                                                                    const randomTop = tops[Math.floor(Math.random() * tops.length)];
                                                                                                                        const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
                                                                                                                            result.innerHTML = `<div class="suggestion"><strong>Today's Suggestion:</strong><br>Top: ${randomTop.name}<br>Bottom: ${randomBottom.name}</div>`;
                                                                                                                              } else {
                                                                                                                                  result.innerHTML = `<div class="suggestion">Please add at least one Top (Shirt/T-shirt) and one Bottom (Pants/Jeans) to your wardrobe!</div>`;
                                                                                                                                    }
                                                                                                                                    });

                                                                                                                                    // 4. Basic AI Stylist (Mock answers for now)
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
                                                                                                                                                                    