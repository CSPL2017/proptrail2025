import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './container/home';
import AboutUs from './container/pages/about_us';
import ContactUs from './container/pages/contact_us';
import Features from './container/pages/features';
import OurTeam from './container/pages/our_team';
import Pricing from './container/pages/pricing';
import Solution from './container/pages/solution';
import WhoWeAre from './container/pages/who_we_are';
import BlogList from './container/blog/blog_list';

function App() {
  return (
    <div className="App">
       <Router>
          <Routes>
            <Route exact path='/' element={<Home />} /> 
            <Route exact path='/about-us' element={<AboutUs />} /> 
            <Route exact path='/contact-us' element={<ContactUs />} /> 
            <Route exact path='/features' element={<Features />} /> 
            <Route exact path='/our-team' element={<OurTeam />} /> 
            <Route exact path='/pricing' element={<Pricing />} /> 
            <Route exact path='/solution' element={<Solution />} /> 
            <Route exact path='/who-we-are' element={<WhoWeAre />} /> 
            <Route exact path='/blog-list' element={<BlogList />} /> 
          </Routes>
      </Router>
    </div>
  );
}

export default App;
