import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Button from '@mui/material/Button';
import { TextField } from '@material-ui/core';

function ViewAllAndSearch() {
  const [childrenData, setChildrenData] = useState([]);
  const [childID, setchildID] = useState('');
  const [childData, setChildData] = useState([]);
  const [idSubmitted, setIdSubmitted] = useState();
  const [gramTotalSugarConsumed, setGramTotalSugarConsumed] = useState(0);

  // Get all children's data
  const getAllChildrenData = async (e) => {
    try {
      const res = await axios.get("http://localhost:6001/")
      setChildrenData(res.data.allChildData);
    } catch (err) {
      console.log(err);
    }
  }

  // Display the children's data once on page load
  useEffect(() => {
    getAllChildrenData();
  }, []);

  // Send user input (foodEaten) as a query to the API
  const handleSearchBasedOnId = async (e) => {
    setIdSubmitted("clicked once");
    try {
      await axios.get(`http://localhost:6001/${childID}`).then((response) => {
        setChildData(response.data[0])

        // Calculate total sugar
        var gramTotalSugarConsumed = 0;
        for (let i = 0; i < (response.data[0]["foodEaten"]).length; i++) {
          let foodQuantity = response.data[0]["quantity"][i];
          let foodSugarLevel = response.data[0]["gramSugarPerServing"][i];

          gramTotalSugarConsumed += foodQuantity * foodSugarLevel;
        }
        setGramTotalSugarConsumed(gramTotalSugarConsumed);
      }).catch((err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div>
        <TextField
          className='textfield'
          type="text"
          placeholder="Child's ID"
          onChange={(e) => setchildID(parseInt(e.target.value))}
          variant="outlined"
        />
        <Button onClick={handleSearchBasedOnId} variant="contained" size="small" style={{ width: 200, height: 30, borderRadius: 5, margin: 10 }} to="/">
          <p>Search based on ID</p>
        </Button>
      </div>


      {idSubmitted === "clicked once" ? <div><h4>{childData.name}'s consumed sugar summary:</h4>  {childData.foodEaten?.map((food, index) => (
        <div key={index}>
          <p>{childData.quantity[index]} {food}, which amounts to {((childData.gramSugarPerServing[index]) * (childData.quantity[index])).toFixed(2)} g sugar</p>
        </div>
      ))}<h3>Total sugar consumed by {childData.name}: {gramTotalSugarConsumed.toFixed(2)} g</h3></div> :
        <div>
          <h4>Child's ID | Name | Food eaten | Quantity eaten</h4>
          {childrenData.map((child, index) => (
            <div key={index}>
              {child.foodEaten.map((food, index) => (
                <div key={index}>
                  <p>{child.id}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;{child.name}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;{food}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;{child.quantity[index]}</p>
                </div>
              ))}

            </div>))}
        </div>
      }
    </div>
  )
}

export default ViewAllAndSearch