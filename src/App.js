import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './container/home';

function App() {
  return (
    <div className="App">
       <Router>
          <Routes>
            <Route exact path='/' activeClassName="active" element={<Home />} /> 
          </Routes>
      </Router>
    </div>
  );
}

export default App;
