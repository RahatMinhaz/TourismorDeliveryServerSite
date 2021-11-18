const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

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
        const anotherFoodCollection = database.collection('foods2');
        const userInfo = database.collection('usersinfo');

        app.get('/usersinfo', async(req,res) =>{
            const email = req.query.email;
            const query = {email: email}
            const cursor = userInfo.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })
        // Sending info to Database
        app.post('/usersinfo', async(req,res) =>{
            const info = req.body;
            const result = await userInfo.insertOne(info);
            res.json(result);
        })

        app.get('/foods', async(req,res) =>{
            const cursor = foodCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        });
        
        app.get('/foods2', async(req,res) =>{
            const cursor = anotherFoodCollection.find({});
            const foods2 = await cursor.toArray();
            res.send(foods2);
        });

        app.get('/foods/:id',async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const food = await foodCollection.findOne(query);
            res.json(food);
        });

        app.delete('/foods/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await foodCollection.deleteOne(query);
            res.json(result);
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