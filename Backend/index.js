import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoute.js"
import companyRoute from "./routes/companyRoute.js";
import jobRoute from "./routes/jobRoute.js";
import applicationRoute from "./routes/applicationRoute.js";
import adminJobRoutes from "./routes/jobRoute.js"

import companyRoutes from "./routes/companyRoute.js"

dotenv.config({});



const app = express();
// app.get("/",(req,res)=>{
//     return res.status(200).json({
//         message:"I am coming from backend",
//         success:true
//     })
// })

//middleware
app.use(express.json())


// Mount routes with this prefix
app.use("/api/admin/job", adminJobRoutes)
app.use("/api/company", companyRoutes);

app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;

//apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);



app.listen(PORT,(req,res)=>{
    connectDB();
    console.log(`server is runnning at ${PORT}`)
})