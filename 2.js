//Cart
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
//Open Cart
cartIcon.onclick = () => {
    cart.classList.add('active');
};
//Close Cart
closeCart.onclick = () => {
    cart.classList.remove('active');
}
//Cart Working jS
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
}
else {
    ready();
}

// Making Function
function ready() {
    // Remove Items from cart
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItems);
    }
    // Quantity Changes
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i++) {
        quantityInputs[i].addEventListener('change', quantityChanged);
    }
    // Add to cart
    var addCart = document.getElementsByClassName('add-cart');
    for (var i = 0; i < addCart.length; i++) {  
        addCart[i].addEventListener('click', addCartClicked)
    }
    //Buy Button Work
    document.getElementsByClassName('btn-buy')[0].addEventListener('click', buyButtonClicked);
}
//Buy Button
function buyButtonClicked() {
    alert("Your Order is placed");
    myProducts=[];
    var cartContent = document.getElementsByClassName('cart-content')[0];
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updatetotal();
}
function findProductIndexByTitle(productTitle) {
    // Implement a function to find the index of the product in your myProducts array based on its title
    // Return -1 if the product is not found
    for (var i = 0; i < myProducts.length; i++) {
        if (myProducts[i].productName === productTitle) {
            return i;
        }
    }
    return -1;
}
//Remove Items from Cart
function removeCartItems(event) {
    var buttonClicked = event.target;
    var cartItem = buttonClicked.parentElement;
    // Find the product title in the same parent element
    var productTitleElement = cartItem.querySelector('.cart-product-title');
    var productTitle = productTitleElement.textContent.trim();// delete space at begin and end

    // Find the index of the product in your myProducts array based on the 'productName'
    var productIndex = findProductIndexByTitle(productTitle);

    // Update the quantity in your myProducts array
    if (productIndex !== -1) {
        // Update the quantity or remove the product as needed
        if (myProducts[productIndex].quantity > 1) {
            // If quantity is greater than 1, decrement the quantity
            myProducts[productIndex].quantity -= 1;
        } else {
            // If quantity is 1 or less, remove the product from the array
            myProducts.splice(productIndex, 1);
        }
    }

    // Remove the cart item from the DOM
    cartItem.remove();

    // Update total after removing the item
    updatetotal();
}
// Quantity Changed
function quantityChanged(event) {
    var input = event.target;
    // set default quantity 1 if NaN or <= 0, using ternary condition
    input.value = (input.value || 0) <= 0 ? 1 : input.value; // short-hand if else
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    var index = Array.prototype.indexOf.call(quantityInputs, input);
    // Check if the index is valid
    if (index !== -1 && index < myProducts.length) {
        // Update the quantity of the product at the corresponding index
        myProducts[index].quantity = parsePriceInCurrency(input.value);
    }
    updatetotal();
}

// Add to Cart
function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    addProductToCart(title, price, productImg);
    renderMyProductsInCart();
}

var myProducts = [];

function addProductToCart(title, price, productImg) {
    // ignore adding to cart if product already existed in cart
    for (var elem of myProducts) {
        if (elem.productName == title) {
            alert("You have already add this item to cart");
            return;
        }
    }

    myProducts.push({
        productName: title,
        productImg: productImg,
        productPrice: parsePriceInCurrency(price),
        quantity: 1
    })

}

function renderMyProductsInCart() {
    var cartItems = document.getElementsByClassName('cart-content')[0];
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    // re-render all products
    for (var elem of myProducts) {
        var cartShopBox = document.createElement('div');
        cartShopBox.classList.add('cart-box');

        cartShopBox.innerHTML = `<img src="${elem.productImg}" alt="" class="cart-img">
                                <div class="detail-box">
                                <div class="cart-product-title">${elem.productName}</div>
                                <div class="cart-price">${formatPriceInCurrency(elem.productPrice)}</div>
                                <input type="number" value="${elem.quantity}" class="cart-quantity">
                                </div>
                                <!-- Remove Cart -->
                                <i class='bx bxs-trash-alt cart-remove'></i>`;
        cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItems);
        cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged);
        cartItems.append(cartShopBox);
    }
    updatetotal();
}

// Update Total
function updatetotal() {
    var total = 0;
    for (var elem of myProducts) {
        // console.log(elem);
        total = total + (elem.productPrice * elem.quantity);
    }
    document.getElementsByClassName('total-price')[0].innerText = formatPriceInCurrency(total);
}


// --- helper functions ---

function parsePriceInCurrency(priceStr) {
    if (typeof priceStr != 'string') return 0;

    var currencySymbols = /[\$d]/; // list of symbols to be removed
    var replaced = priceStr.replace(currencySymbols, "").replaceAll(",", "");

    return parseFloat(replaced);
}

function formatPriceInCurrency(price) {
    return "$" + price;
}
