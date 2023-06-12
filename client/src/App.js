import './App.css';
import MainForm from './MainForm'
import bgimage from "./images/sugaryfoods.jpg";

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ backgroundImage: `url(${bgimage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
      <div></div>
        <div style={{ padding: 20, backgroundColor: "rgba(255,255,255,0.8)" }}>
          <h1>Sugar tracker</h1>
          <h6>The American Heart Association recommends children and teens consume less than 25 grams, or 6 teaspoons, of added sugar per day.</h6>
          <h4>Track your children's sugar intake</h4>
          <MainForm />
        </div>
      </header>
    </div>
  );
}

export default App;
