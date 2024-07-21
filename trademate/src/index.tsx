import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router ,Routes,Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/login/Login';
import Register from './Pages/login/Register';
import History from './Pages/History/History';
import Header from './Header/header';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store ,{ persistor } from './store';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <Router>
          <Routes>
            <Route path='/' element={
              <div>
                  <Header/>
                  <App/>
              </div>
              }/>
            <Route path='/history' element={
              <div>
                <Header/>
                <History/>
              </div>
              }/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
          </Routes>
        </Router>
      </React.StrictMode>
    </PersistGate>
</Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
