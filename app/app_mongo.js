const express = require('express')
const app = express()
const port = 3000

const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb://root:admin@mongo";

const client = new MongoClient(uri);

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('academico');
      const movies = database.collection('estudantes');
  
      // Query for a movie that has the title 'Back to the Future'
      const query = { title: 'Back to the Future' };
      await movies.deleteOne(query);
  
      const movie = await movies.find();
      let cursor = await movies.find();
      let estudantes = await cursor.toArray();
  
      console.log('movie', estudantes);
      res.render('lista', {estudantes});
    //   res.json(estudantes);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})