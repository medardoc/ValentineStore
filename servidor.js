const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const connection = require('./bdd'); // Conexión a la base de datos

const app = express();
const PORT = 3003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/CSS', express.static(path.join(__dirname, 'CSS')));
app.use('/JS', express.static(path.join(__dirname, 'JS')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/index', express.static(path.join(__dirname, 'index')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ValentineStore.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'Cart.html'));
});

app.post('/send-email', (req, res) => {
    const { email, cart } = req.body;

    console.log('Datos del carrito:', cart); // Agregado para depuración

    // Calcular el total de la compra
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'example@hotmail.com', //Aqui pones tus credenciales para enviar el mensaje al destinario
            pass: 'Example1234'
        }
    });

    const mailOptions = {
        from: 'example@hotmail.com',
        to: email,
        subject: 'Compra Confirmada',
        text: `Su compra ha sido confirmada. Detalles del carrito: ${JSON.stringify(cart)}\n\nMonto total: $${totalAmount.toFixed(2)}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ success: false });
        } else {
            console.log('Correo enviado:', info.response);
            res.status(200).json({ success: true });
        }
    });
});

app.post('/process-purchase', (req, res) => {
    const { name, lastname, email } = req.body;

    const query = 'INSERT INTO Usuarios (Nombre, Apellido, Email) VALUES (?, ?, ?)';
    connection.execute(query, [name, lastname, email], (err, results) => {
        if (err) {
            console.error('Error saving user:', err);
            res.status(500).json({ success: false });
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'example@hotmail.com', //Aqui pones tus credenciales para enviar el mensaje al destinario
                pass: 'Example1234'
            }
        });

        const mailOptions = {
            from: 'example@hotmail.com',
            to: email,
            subject: 'Compra realizada con éxito',
            text: `Gracias por su compra, en las proxima hora uno de nuestros ejecutivos se contactara con usted para coordinar la entrega.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ success: false });
            } else {
                console.log('Email sent: ' + info.response);
                res.redirect(303, '/'); // Redirigir a la página principal después de procesar la compra
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
