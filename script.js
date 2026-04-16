// Global App State (Task 10 - React Readiness)
const state = {
    products: [],
    cart: 0
};
const grid = document.getElementById('product-grid');
const categoryMenu = document.getElementById('category-select');
const loader = document.getElementById('loader');
const errorUI = document.getElementById('error-msg');
const cartBadge = document.getElementById('cart-count');
async function initApp() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        console.log("Data loaded:", data); 

        state.products = data; 
        populateCategories(data); // Dropdown bharna
        renderProducts(data); // <--- YE SABSE ZARURI HAI
    } catch (err) {
        console.error(err);
    } finally {
        loader.classList.add('d-none');
    }
}

// Reusable Renderer (Task 8)
function renderProducts(items) {
    grid.innerHTML = items.length > 0 
        ? items.map(p => `
            <div class="col">
                <div class="card h-100 shadow-sm p-2 border-0 product-card">
                    <img src="${p.image}" class="card-img-top p-3" alt="${p.title}" style="height: 200px; object-fit: contain;">
                    <div class="card-body d-flex flex-column">
                        <small class="text-uppercase text-muted fw-bold">${p.category}</small>
                        <h6 class="card-title text-truncate" title="${p.title}">${p.title}</h6>
                        <h5 class="text-primary mt-auto">$${p.price}</h5>
                        <div class="mt-3 d-grid gap-2">
                            <button class="btn btn-outline-dark btn-sm" onclick="showInfo(${p.id})">Details</button>
                            <button class="btn btn-primary btn-sm" onclick="addToCartUI()">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('')
        : `<div class="w-100 text-center py-5"><h5>No products found.</h5></div>`;
}

// Filters & Sort (Task 2, 3, 5)
function handleFilterSort() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const category = categoryMenu.value;
    const sort = document.getElementById('sort-select').value;

    let result = state.products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search);
        const matchesCategory = category === 'all' || p.category === category;
        return matchesSearch && matchesCategory;
    });

    if (sort === 'low') result.sort((a, b) => a.price - b.price);
    if (sort === 'high') result.sort((a, b) => b.price - a.price);

    renderProducts(result);
}

// Extract Categories (Task 2)
function populateCategories(data) {
    const categories = ['all', ...new Set(data.map(p => p.category))];
    categoryMenu.innerHTML = categories.map(cat => 
        `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
    ).join('');
}

// Details Modal (Task 4)
function showInfo(id) {
    const p = state.products.find(item => item.id === id);
    document.getElementById('modal-body-content').innerHTML = `
        <div class="modal-header border-0 pb-0">
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-center p-4">
            <img src="${p.image}" class="img-fluid mb-3" style="max-height: 250px;">
            <h5 class="fw-bold">${p.title}</h5>
            <p class="text-muted small">${p.description}</p>
            <div class="d-flex justify-content-between align-items-center mt-4">
                <span class="fs-4 fw-bold text-success">$${p.price}</span>
                <span class="badge bg-warning text-dark">⭐ ${p.rating.rate} / 5</span>
            </div>
        </div>
    `;
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

// Cart Logic (Task 6)
function addToCartUI() {
    state.cart++;
    cartBadge.innerText = state.cart;
}

// Event Listeners
document.getElementById('search-input').addEventListener('input', handleFilterSort);
categoryMenu.addEventListener('change', handleFilterSort);
document.getElementById('sort-select').addEventListener('change', handleFilterSort);

initApp();