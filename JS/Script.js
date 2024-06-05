document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.slides');
    const slideArray = Array.from(document.querySelectorAll('.slide'));
    let index = 0;

    function showNextSlide() {
        index++;
        if (index >= slideArray.length) {
            index = 0;
        }
        updateSlidePosition();
    }

    function updateSlidePosition() {
        slides.style.transform = `translateX(${-index * 100}%)`;
    }

    setInterval(showNextSlide, 3000);

    // Manejar el carrito de compras
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const price = parseFloat(button.getAttribute('data-price'));

            const cartItem = cart.find(item => item.product === product);

            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ product, price, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${product} ha sido agregado al carrito.`);
        });
    });
});
