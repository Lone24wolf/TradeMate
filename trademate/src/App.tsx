import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from './Pages/Home/Home'
import Header from './Header/header';
function App() {
  // console.log("gaurav")
  return (
    <div className="App">
      <header className="App-header">
       <Header/>
       <Home/>
      </header>
    </div>
  );
}

export default App;
