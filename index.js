const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');
const productRoutes = require('./routes/productsRoutes');
const stripe =require("stripe")(
    "sk_test_51QKkoAEFkjYi4pbxUXAB6Klh3vnFDo350H0e8T0p38d6jggNxadrD3Umnp8tBteKk1l4o650BLdSIjv2SSe94qct00ToNfploM"
)
const Order = require('./models/OrdersModel')




const app = express()
const http = require('http');
const server =http.createServer(app);




require('dotenv').config()
require('./helpers/init_mongodb')


app.use(express.json())
app.use(cors(
    {
        origin:'http://localhost:3000'
    }
))

app.use('/user', userRoutes)
app.use('/products', productRoutes)





app.route('/check').get((req, res) => {
    res.send('Hello World!')
  });

  app.post("/payment", async (req, res) => {
    const { amount } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({ error: "Invalid payment amount" });
    }

    

    console.log("Payment Request Received", amount);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd", //stripe expects lowercase currency codes.
        });

        res.status(201).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating PaymentIntent:", error);
        res.status(500).json({ error: "Failed to create PaymentIntent" });
    }
});

app.post("/addorder", async (req, res) => {
    const { basket, price, email } = req.body;

    if (!basket || !price || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const order = new Order({ price, products: basket, email });
        await order.save();
        res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
})

//get orders
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});
app.delete('/orders/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
  
      // Check if the order exists
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Delete the order
      await Order.findByIdAndDelete(orderId);
  
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ error: 'Failed to delete order' });
    }
  });


const port = 5000

server.listen(port,"0.0.0.0", () => {
    console.log(`Ticket  app listening at http://localhost:${port}`)
  })