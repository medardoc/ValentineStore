document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <h3>${item.product}</h3>
                <p>Precio: $${item.price}</p>
                <p>Cantidad: ${item.quantity}</p>
                <button class="remove-item" data-product="${item.product}">Eliminar</button>
            `;

            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = total.toFixed(2);
    }

    updateCart();

    cartItemsContainer.addEventListener('click', event => {
        if (event.target.classList.contains('remove-item')) {
            const product = event.target.getAttribute('data-product');
            const cartIndex = cart.findIndex(item => item.product === product);

            if (cartIndex > -1) {
                cart.splice(cartIndex, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            }
        }
    });

    checkoutButton.addEventListener('click', () => {
        alert('Procediendo al pago...');
    });
});
