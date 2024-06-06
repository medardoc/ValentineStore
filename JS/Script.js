/*Aqui codificamos el script para las funcionalidades y logica de la pagina, las cuales se encuentran referenciadas en cada archivo html*/

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

    const modal = document.getElementById('emailModal');
    const closeButton = document.querySelector('.close-button');
    const emailForm = document.getElementById('emailForm');

    document.querySelector('.cart-button').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío.');
        } else {
            modal.style.display = 'block';
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    emailForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;

        fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, cart })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Compra completada. Se ha enviado un correo de confirmación.');
                localStorage.removeItem('cart');
                modal.style.display = 'none';
            } else {
                alert('Hubo un problema al procesar su compra. Intente nuevamente.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al procesar su compra. Intente nuevamente.');
        });
    });
});
