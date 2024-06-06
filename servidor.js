/*Aqui tenemos la codificacion del servidor para conectarse a traves de un puerto, mostrandonos asi el contenido de la pagina*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
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

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Compra Confirmada',
        text: `Su compra ha sido confirmada. Detalles del carrito: ${JSON.stringify(cart)}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            res.json({ success: false });
        } else {
            console.log('Correo enviado:', info.response);
            res.json({ success: true });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
