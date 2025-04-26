const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const chatbotRoutes = require("./routes/chatbotRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/chatbot", chatbotRoutes);
app.use('/api/doctors', doctorRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
