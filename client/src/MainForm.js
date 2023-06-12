import React, { useState } from 'react'
import { TextField } from '@material-ui/core';
import Button from '@mui/material/Button';
import axios from 'axios'
import ViewAllAndSearch from './ViewAllAndSearch';

function MainForm() {
  const [childID, setchildID] = useState('');
  const [childName, setchildName] = useState('');
  const [foodEaten, setfoodEaten] = useState('');
  const [gramSugarPerServing, setGramSugarPerServing] = useState('');
  const [listOfFoodEaten, setlistOfFoodEaten] = useState([]);
  const [quantityEaten, setQuantityEaten] = useState([""]);
  const [viewAllSubmitted, setViewAllSubmitted] = useState(false);
  const [findFoodItemSubmitted, setFindFoodItemSubmitted] = useState(false);
  const [buttonText, setButtonText] = useState('');

  // Send user input (foodEaten) as a query to the API
  const handleFindFoodItem = async (e) => {
    setFindFoodItemSubmitted(!findFoodItemSubmitted);
    try {
      await axios.post("http://localhost:6001/foodItem", { foodEaten }).then((response) => {
        setlistOfFoodEaten(response.data)
      }).catch((err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  }

  // Getting a food's sugar amount to use in "handleSubmit" function below.
  const handleClickFoodListItem = async (e) => {
    try {
      const foodEatenSelected = e.target.textContent;
      setfoodEaten(foodEatenSelected)

      await axios.post("http://localhost:6001/foodItem2", { foodEatenSelected }).then((response) => {
        setGramSugarPerServing(response.data.gramSugarPerServing)
      }).catch((err) => {
        console.log(err);
      });

    } catch (err) {
      console.log(err);
    }
  }


  // Add all form data to database
  const handleSubmit = async (e) => {
    try {
      await axios.post("http://localhost:6001/", { childID, childName, foodEaten, quantityEaten, gramSugarPerServing });
    } catch (err) {
      console.log(err);
    }
  }

  const handleViewAllSubmitted = async (e) => {
    setViewAllSubmitted(!viewAllSubmitted);
    setButtonText(buttonText);
  }

  return (
    <div>
      <div>
      {viewAllSubmitted ? <ViewAllAndSearch /> : <form className='main-form'>
          <div>Child's id:&nbsp;&nbsp;
            <TextField
              className='textfield'
              type="text"
              placeholder="Child's id"
              onChange={(e) => setchildID(parseInt(e.target.value))}
              variant="outlined"
            /></div>

          <div>Child's name:&nbsp;&nbsp;
            <TextField
              className='textfield'
              type="text"
              placeholder="Child's name"
              onChange={(e) => setchildName(e.target.value)}
              variant="outlined"
            /></div>

          <div>Food eaten:&nbsp;&nbsp;
            <TextField
              className='textfield'
              type="text"
              placeholder="Food eaten"
              onChange={(e) => setfoodEaten(e.target.value)}
              variant="outlined"
            />
            <Button onClick={handleFindFoodItem} variant="contained" size="small" style={{ width: 200, height: 30, borderRadius: 5, margin: 10 }} to="/">
              <p>Find food item</p>
            </Button>
            {!findFoodItemSubmitted && listOfFoodEaten.length === 0 ? <div></div> : <div style={{ fontWeight: "bold", color: "red" }}><div style={{ fontWeight: "bolder", color: "blue" }}>Click to select</div>Selected item: {foodEaten}</div>}

            {listOfFoodEaten.map((food, index) => (
              <div id='foodListItem' key={index} onClick={handleClickFoodListItem}>{food}</div>
            ))}
          </div>

          <div>Quantity eaten:&nbsp;&nbsp;
            <TextField
              className='textfield'
              type="text"
              placeholder="Quantity eaten"
              onChange={(e) => setQuantityEaten(e.target.value)}
              variant="outlined"
            />(an average serving)</div>

          <Button onClick={handleSubmit} variant="contained" size="small" style={{ width: 120, height: 30, borderRadius: 5, margin: 10 }} to="/">
            <p>Submit</p>
          </Button>

        </form>}
      </div>

      <Button onClick={handleViewAllSubmitted} variant="contained" size="small" style={{ width: 200, height: 30, borderRadius: 5, margin: 10 }} to="/">
        {viewAllSubmitted ? "Back to form" : "View all submitted"}
      </Button>
    </div>
  )
}

export default MainForm