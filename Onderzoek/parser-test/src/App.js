import logo from './logo.svg';
import './App.css';

function App() {

  const fetchArticle = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:3000/', {
      mode: 'no-cors'
    })
      .then(response => response.json())
      .catch(err => console.log('Error: ', err))
  }
  return (
    <div className="App">

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={fetchArticle}>Fetch article</button>
      </header>
    </div>
  );
}

export default App;
