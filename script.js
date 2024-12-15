// Constants
const TAX_RATE = 0.15;

// DOM Elements
const productList = document.getElementById("productList");
const productQuantity = document.getElementById("productQuantity");
const addToCartBtn = document.getElementById("addToCartBtn");
const cartItems = document.getElementById("cartItems");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const deliveryLocationSelect = document.getElementById("deliveryLocation");
const confirmOrderBtn = document.getElementById("confirmOrder");

// Price Display Elements
const subtotalDisplay = document.getElementById("subtotalDisplay");
const taxDisplay = document.getElementById("taxDisplay");
const deliveryDisplay = document.getElementById("deliveryDisplay");
const discountRow = document.getElementById("discountRow");
const discountDisplay = document.getElementById("discountDisplay");
const totalPriceDisplay = document.getElementById("totalPriceDisplay");
const priceBreakdown = document.getElementById("priceBreakdown");

// Cart Management
let cart = [];

// Event Listeners
addToCartBtn.addEventListener("click", addToCart);
deliveryLocationSelect.addEventListener("change", calculateTotalPrice);
confirmOrderBtn.addEventListener("click", confirmOrder);

// Add Product to Cart
function addToCart() {
  // Get selected product details
  const selectedOption = productList.options[productList.selectedIndex];

  // Validate selection
  if (!selectedOption || selectedOption.value === "") {
    alert("Please select a product");
    return;
  }

  const productName = selectedOption.dataset.name;
  const productPrice = parseFloat(selectedOption.dataset.price);
  const quantity = parseInt(productQuantity.value);

  // Check if product already exists in cart
  const existingProductIndex = cart.findIndex(
    (item) => item.name === productName
  );

  if (existingProductIndex > -1) {
    // Update quantity if product exists
    cart[existingProductIndex].quantity += quantity;
  } else {
    // Add new product to cart
    cart.push({
      name: productName,
      price: productPrice,
      quantity: quantity,
    });
  }

  // Update cart display and calculations
  updateCartDisplay();
  calculateTotalPrice();

  // Reset product selection
  productList.selectedIndex = 0;
  productQuantity.value = 1;
}

// Update Cart Display
function updateCartDisplay() {
  // Clear existing cart items
  cartItems.innerHTML = "";

  // Show/hide empty cart message
  emptyCartMessage.style.display = cart.length === 0 ? "block" : "none";

  // Populate cart items
  cart.forEach((item, index) => {
    const row = document.createElement("tr");

    // Calculate item total
    const itemTotal = item.price * item.quantity;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price} BDT</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" 
               class="quantity-input" data-index="${index}">
      </td>
      <td>${itemTotal} BDT</td>
      <td>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </td>
    `;

    cartItems.appendChild(row);
  });

  // Add event listeners for quantity changes and remove buttons
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", updateQuantity);
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", removeFromCart);
  });

  // Enable/Disable Confirm Order button based on cart items
  confirmOrderBtn.disabled = cart.length === 0;
}

// Update Quantity
function updateQuantity(event) {
  const index = event.target.dataset.index;
  const newQuantity = parseInt(event.target.value);

  if (newQuantity > 0) {
    cart[index].quantity = newQuantity;
    updateCartDisplay();
    calculateTotalPrice();
  }
}

// Remove Product from Cart
function removeFromCart(event) {
  const index = event.target.dataset.index;
  cart.splice(index, 1);
  updateCartDisplay();
  calculateTotalPrice();
}

// Calculate Total Price
function calculateTotalPrice() {
  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate tax (15%)
  const tax = subtotal * TAX_RATE;

  // Get delivery fee based on location
  const deliveryFee = parseFloat(deliveryLocationSelect.value);

  // Calculate total price
  const total = subtotal + tax + deliveryFee;

  // Display Price Breakdown
  subtotalDisplay.textContent = `${subtotal} BDT`;
  taxDisplay.textContent = `${tax.toFixed(2)} BDT`;
  deliveryDisplay.textContent = `${deliveryFee} BDT`;

  // Update discount if any (you can add discount logic here)
  discountRow.style.display = "none";
  discountDisplay.textContent = "0 BDT"; // Adjust if discounts are implemented.

  totalPriceDisplay.textContent = `${total.toFixed(2)} BDT`;
  priceBreakdown.style.display = "block";
}

// Confirm Order
function confirmOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items to the cart before confirming.");
    return;
  }

  // Here you can send the order data to the server or perform other actions.
  alert("Order Confirmed! Thank you for ordering.");

  // Reset cart after confirming the order
  cart = [];
  updateCartDisplay();
  calculateTotalPrice();
}
