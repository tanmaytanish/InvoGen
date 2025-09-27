require("dotenv").config();
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const aiRoutes = require('./routes/aiRoutes')


const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: "*",
        methods: ['GET','POST','PUT','DELETE'],
        allowedHeaders : ["Content-Type","Authorization"],
    })
)

// Connect DB
connectDB()

// Middleware
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/invoices", invoiceRoutes)
app.use("/api/ai", aiRoutes)

app.post('/api/ai/ping', (req, res) => {
  res.send("pong");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server running on PORT ${PORT}`))