require("dotenv").config()
const express = require("express")
const app = express()

const cors = require("cors")
const axios  = require("axios")

app.use(express.json())

app.use(cors())

app.get("/",(req,res)=>{
    res.send("API")
})



app.post("/search",(req,res)=>{
    const searchWord = req.body.search

    const url = `https://serpapi.com/search.json?engine=google_scholar&q=${searchWord}&lgoogle_domain=google.com&gl=us&hl=en&device=desktop&api_key=${process.env.SERP_API_KEY}`

     axios.get(url).then((response)=>{
        if(response.status == 200){
            res.send(response.data)
        }
    })



})



app.listen(3001,()=>{
    console.log("listening to 3001");
})