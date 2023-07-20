var productList;

class Product {
    constructor(id, name, price, screen, backCamera, frontCamera, img, desc, type) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.screen = screen;
        this.backCamera = backCamera;
        this.frontCamera = frontCamera;
        this.img = img;
        this.desc = desc;
        this.type = type;
    }
}

function renderProductList(productList) {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = "";

    if (productList.length === 0) {
        const noResultMessage = document.createElement("p");
        noResultMessage.textContent = "Không tìm thấy sản phẩm.";
        productContainer.appendChild(noResultMessage);
    } else {
        productList.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");
            productDiv.setAttribute("data-id", product.id);
            productDiv.setAttribute("data-name", product.name);
            productDiv.setAttribute("data-price", product.price);
            productDiv.setAttribute("data-type", product.type);

            const productImage = document.createElement("img");
            productImage.src = product.img;
            productDiv.appendChild(productImage);

            const productId = document.createElement("p");
            productId.textContent = `Mã sản phẩm: ${product.id}`;
            productDiv.appendChild(productId);

            const productName = document.createElement("p");
            productName.textContent = `Tên sản phẩm: ${product.name}`;
            productDiv.appendChild(productName);

            const productPrice = document.createElement("p");
            productPrice.textContent = `Giá: $${product.price}`;
            productDiv.appendChild(productPrice);

            const addToCartButton = document.createElement("button");
            addToCartButton.textContent = "Thêm vào giỏ hàng";
            addToCartButton.addEventListener("click", function () {
                addToCart(productDiv);
            });
            productDiv.appendChild(addToCartButton);

            productContainer.appendChild(productDiv);
        });
    }
}

function getProducts() {
    axios.get('https://64b3a1380efb99d862683420.mockapi.io/Mobilephone')
        .then(response => {
            productList = response.data; // Danh sách sản phẩm từ API

            // Tạo giao diện cho từng sản phẩm
            renderProductList(productList)
        })
        .catch(error => {
            console.error(error);
        });
}

function addProduct(product) {
    axios.post('https://64b3a1380efb99d862683420.mockapi.io/Mobilephone', product)
        .then(response => {
            const addedProduct = response.data; // Sản phẩm đã được thêm từ API
            getProducts();
        })
        .catch(error => {
            console.error(error);
        });
}

// Xóa sản phẩm
function deleteProduct(productId) {
    axios.delete(`https://64b3a1380efb99d862683420.mockapi.io/Mobilephone/${productId}`)
        .then(response => {
            getProducts();
        })
        .catch(error => {
            console.error(error);
        });
}

// Sửa sản phẩm
function updateProduct(productId, updatedProduct) {
    axios.put(`https://64b3a1380efb99d862683420.mockapi.io/Mobilephone/${productId}`, updatedProduct)
        .then(response => {
            const updatedProduct = response.data; // Sản phẩm đã được cập nhật từ API
            getProducts();
        })
        .catch(error => {
            console.error(error);
        });
}

// Tìm kiếm sản phẩm theo tên
function searchProducts(keyword) {
    axios.get(`https://64b3a1380efb99d862683420.mockapi.io/Mobilephone?search=${keyword}`)
        .then(response => {
            const productList = response.data;
            renderProductList(productList);
        })
        .catch(error => {
            console.error(error);
        });
}

// Gắn sự kiện tìm kiếm khi người dùng nhấn Enter
document.getElementById('search-input').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const keyword = event.target.value.trim();
        if (keyword !== '') {
            searchProducts(keyword);
        }
    }
});

// Gắn sự kiện tìm kiếm khi người dùng nhấn nút Tìm kiếm
document.getElementById('search-button').addEventListener('click', function (event) {
    const keyword = document.getElementById('search-input').value.trim();
    if (keyword !== '') {
        searchProducts(keyword);
    }
});

document.getElementById("sort-button").addEventListener("click", function () {
    const sortOption = document.getElementById("sort-button").textContent;
    if (sortOption === "Sắp xếp theo giá") {
        sortProductsByPriceAscending(productList);
        document.getElementById("sort-button").textContent = "Sắp xếp theo giá (ngược lại)";
    } else {
        sortProductsByPriceDescending(productList);
        document.getElementById("sort-button").textContent = "Sắp xếp theo giá";
    }
});

// Sắp xếp sản phẩm theo giá từ bé đến lớn
function sortProductsByPriceAscending(productList) {
    const sortedProducts = productList.sort((a, b) => a.price - b.price);
    renderProductList(sortedProducts);
}

// Sắp xếp sản phẩm theo giá từ lớn đến bé
function sortProductsByPriceDescending(productList) {
    const sortedProducts = productList.sort((a, b) => b.price - a.price);
    renderProductList(sortedProducts);
}

// filter theo select loại sản phẩm
function filterProducts() {
const selectedValue = document.getElementById("productFilter").value;
if (selectedValue === "all") {
    renderProductList(productList);
} else {
    const filteredProducts = productList.filter(product => product.type.toLowerCase() === selectedValue.toLowerCase());
    renderProductList(filteredProducts);
}
}

// Mảng giỏ hàng (biến toàn cục)
let cart = [];

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    const productId = product.getAttribute("data-id");
    const productName = product.getAttribute("data-name");
    const productPrice = parseFloat(product.getAttribute("data-price"));

    const cartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
    };

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
    const existingCartItem = cart.find(item => item.id === cartItem.id);
    if (existingCartItem) {
        existingCartItem.quantity++;
    } else {
        cart.push(cartItem);
    }

    updateCartUI();
}

// Cập nhật giao diện giỏ hàng
function updateCartUI() {
    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = "";

    cart.forEach(item => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.classList.add("cart-item");

        const itemName = document.createElement("p");
        itemName.textContent = item.name;
        cartItemDiv.appendChild(itemName);

        const itemQuantity = document.createElement("p");
        itemQuantity.textContent = `Số lượng: ${item.quantity}`;
        cartItemDiv.appendChild(itemQuantity);

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = item.quantity;
        quantityInput.min = 1;
        quantityInput.addEventListener("change", function () {
            updateCartItemQuantity(item.id, quantityInput.value);
        });
        cartItemDiv.appendChild(quantityInput);

        const itemTotal = document.createElement("p");
        const totalValue = item.price * item.quantity;
        itemTotal.textContent = `Tổng: $${totalValue.toFixed(2)}`;
        cartItemDiv.appendChild(itemTotal);

        const increaseQuantityButton = document.createElement("button");
        increaseQuantityButton.textContent = "Tăng";
        increaseQuantityButton.addEventListener("click", function () {
            increaseCartItemQuantity(item.id);
        });
        cartItemDiv.appendChild(increaseQuantityButton);

        const decreaseQuantityButton = document.createElement("button");
        decreaseQuantityButton.textContent = "Giảm";
        decreaseQuantityButton.addEventListener("click", function () {
            decreaseCartItemQuantity(item.id);
        });
        cartItemDiv.appendChild(decreaseQuantityButton);

        cartContainer.appendChild(cartItemDiv);
    });

    // Hiển thị thông tin tổng giá trị giỏ hàng
    const cartTotal = document.getElementById("cart-total");
    const totalValue = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotal.textContent = `Tổng giá trị giỏ hàng: $${totalValue.toFixed(2)}`;

    // Hiển thị số lượng sản phẩm trong giỏ hàng
    const cartQuantity = document.getElementById("cart-quantity");
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartQuantity.textContent = `Số lượng sản phẩm trong giỏ hàng: ${totalQuantity}`;
}

// Tăng số lượng sản phẩm trong giỏ hàng
function increaseCartItemQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
        updateCartUI();
    }
}

// Giảm số lượng sản phẩm trong giỏ hàng
function decreaseCartItemQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
        } else {
            removeFromCart(productId);
        }
        updateCartUI();
    }
}

// Xóa sản phẩm ra khỏi giỏ hàng
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Mở khung chứa thông tin giỏ hàng
function openCartModal() {
    const modal = document.getElementById("cartModal");
    modal.style.display = "block";
}

// Đóng khung chứa thông tin giỏ hàng
function closeCartModal() {
    const modal = document.getElementById("cartModal");
    modal.style.display = "none";
}

// Lưu giỏ hàng vào LocalStorage
function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Load giỏ hàng từ LocalStorage
function loadCartFromLocalStorage() {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
        cart = JSON.parse(cartData);
        updateCartUI();
    }
}

// Người dùng nhấn nút thanh toán
function clearCart() {
    cart = [];
    updateCartUI();
}

// Khi trang được tải, gọi hàm để lấy danh sách sản phẩm ban đầu và load giỏ hàng từ LocalStorage
window.addEventListener('load', function () {
    getProducts();
    loadCartFromLocalStorage();
});