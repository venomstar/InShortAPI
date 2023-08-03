const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const getNews = require("./inShort"); 

app.use(cors());

app.get("/api/:id",async (req,res)=>{
  try{
  const {id} =  req.params;  
  const data = await getNews(id);
  res.json(data);
  }
  catch(err){
    res.status(500).json(err);

  }
})

app.listen(port,()=>{
  console.log(`Server is running on ${port}`);
})

