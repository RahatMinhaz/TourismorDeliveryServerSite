const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h4bqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run(){
    try{
        await client.connect();
        const database = client.db('food_items');
        const foodCollection = database.collection('foods');


        app.get('/foods', async(req,res) =>{
            const cursor = foodCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        })
    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req,res) =>{
    res.send('Pizza Paradise is running');
});

app.listen(port, () =>{
    console.log("Server is running at port",port);
})