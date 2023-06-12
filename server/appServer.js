// Create express app
const express = require('express')
const app = express()
app.use(express.json())

// To parse json POST request
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to database and create model
const { connectDB } = require('./connectDB.js')
const dataModel = require('./dataSchema.js')

// Use CORS
const cors = require('cors');
app.use(cors());

// For HTTP requests
const axios = require('axios');

// Connect to the database and to the server
const dotenv = require("dotenv");
dotenv.config({ path: '../.env' });

async function start() {
  await connectDB();

  app.listen(process.env.appServerPORT || 6001, async function (err) {
    if (err) {
      console.log("Could not connect server")
    } else {
      console.log(`Example app listening on port ${process.env.appServerPORT}`)
    }
  });
}
start()

// GET: get all children's data
app.get('/', async (req, res) => {
  try {
    let allChildData = await dataModel.find({})  // all child data
    res.json({ allChildData })
  } catch (err) {
    console.log(err);
    res.json({ msg: "Error: Could not get child data." })
  }
})


//GET: get a child's data (by id)
app.get('/:id', async (req, res) => {

  var reqParamsID = req.params.id
  var foundChild = await dataModel.find({ "id": reqParamsID })

  if (foundChild.length != 0) {
    res.json(foundChild)
  } else {
    throw new Error('No child found with the specified ID.');
  }
})


//POST: get food description from API
app.post('/foodItem', async (req, res) => {
  var { foodEaten } = req.body;

  try {
    const foodsToSelectFrom = [];

    // Querying the API
    const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodEaten}`, {
      headers: {
        "Content-Type": "application/json",
        'x-api-key': `${process.env.API_KEY}`
      },
    })

    for (let i = 0; i < 10; i++) {
      foodsToSelectFrom.push(response.data.foods[i]["description"])
    }
    res.send(foodsToSelectFrom)
  } catch (err) {
    console.log(err);
  }
})

//GET: get food sugar amount from API
app.post('/foodItem2', async (req, res) => {

  const { foodEatenSelected } = req.body

  try {
    // add food items to array
    const foodsToSelectFrom = [];
    var gramSugarPerServing = 0;

    // Use actual API
    const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodEatenSelected}`, {
      headers: {
        "Content-Type": "application/json",
        'x-api-key': `${process.env.API_KEY}`
      },
    })

    for (let i = 0; i < 10; i++) {
      foodsToSelectFrom.push(response.data.foods[i]["description"])

      // Put if statement here. If foodEaten == description in json, set gramSugarPerServing to be the gram value from API
      // Find correct food
      if ((response.data.foods[i]["description"] == foodEatenSelected)) {

        // Find correct food nutrient
        for (let j = 0; j < (response.data.foods[i]["foodNutrients"]).length; j++) {
          if (response.data.foods[i]["foodNutrients"][j]["nutrientName"] == "Sugars, total including NLEA") {
            gramSugarPerServing = response.data.foods[i]["foodNutrients"][j]["value"]
          }
        }
      }
    }
    res.send({ gramSugarPerServing })
  } catch (err) {
    console.log(err);
  }
})


// POST: create a new child data entry
app.post('/', async (req, res) => {
  try {
    const childIDInt = parseInt(req.body.childID);
    const foodEaten = [req.body.foodEaten];
    const quantity = [req.body.quantityEaten];
    const gramSugarPerServing = [req.body.gramSugarPerServing]

    dataModel.findOne({ "id": req.body.childID }).then((result) => {
      if (result) {
        // item exists, update it
        dataModel.updateOne(
          { id: req.body.childID },
          {
            $push: {
              foodEaten: foodEaten,
              quantity: quantity,
              gramSugarPerServing: gramSugarPerServing
            }
          }
        ).then((result) => {
          // handle result of update operation
          res.json({ result })
        }).catch((err) => {
          console.log(err)
        });
      } else {
        var childData = {
          id: req.body.childID,
          name: req.body.childName,
          foodEaten: foodEaten,
          quantity: quantity,
          gramSugarPerServing: req.body.gramSugarPerServing
        }
        dataModel.create(childData)
        res.json({ childData })
      }
    }).catch((err) => {
      console.log(err)
    });

  } catch (err) {
    console.log(err)
    res.json({ msg: "Error adding child data" })
    throw new Error('Could not insert data to database.');
  }
})