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
        const userInfo2 = database.collection('usersinfo2');

        // Managing all orders data

        app.get('/usersinfo2', async(req,res) =>{
            const cursor = userInfo2.find({});
            const orders2 = await cursor.toArray();
            res.send(orders2);
        });

        // Posting all ordered items on UI

        app.post('/usersinfo2', async(req,res) =>{
            const info2 = req.body;
            const result = await userInfo2.insertOne(info2);
            res.json(result);
        });

        // Deleting an order

        app.delete('/usersinfo2/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userInfo2.deleteOne(query);
            res.json(result);
        })

        // Showing logged in user's ordered item

        app.get('/usersinfo', async(req,res) =>{
            const email = req.query.email;
            const query = {email: email}
            const cursor = userInfo.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        });

        // Sending info to Database
        app.post('/usersinfo', async(req,res) =>{
            const info = req.body;
            const result = await userInfo.insertOne(info);
            res.json(result);
        });


        // Deleting an order of the user

        app.delete('/usersinfo/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userInfo.deleteOne(query);
            res.json(result);
        });

        app.get('/usersinfo/:id',async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userInfo.findOne(query);
            res.json(result);
        })
        // Showing offerings on the home and menu page

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

        // Adding a new offering on home page

        app.post('/foods2', async(req,res) =>{
            const newItem = req.body;
            const result = await anotherFoodCollection.insertOne(newItem);
            res.json(result);
        });

        // Placing an order

        app.get('/foods/:id',async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const food = await foodCollection.findOne(query);
            res.json(food);
        });

        // Deleting an order

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