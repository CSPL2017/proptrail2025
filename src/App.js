import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Home from './container/home';
import AboutUs from './container/pages/about_us';
import ContactUs from './container/pages/contact_us';
import Features from './container/pages/features';
import OurTeam from './container/pages/our_team';
import Pricing from './container/pages/pricing';
import Solution from './container/pages/solution';
import WhoWeAre from './container/pages/who_we_are';
import BlogList from './container/blog/blog_list';
import TermsConditions from './container/pages/terms_conditions';
import PrivacyPolicy from './container/pages/privacy_policy';
import { ToastContainer } from 'react-toastify';
import Dashboard from './container/my_account/dashboard';
import ProtectedRoute from './component/services/ProtectedRoutes';

function App() {
  return (
    <div className="App">
      <ToastContainer />
       <Router>
          <Routes>
            <Route exact path='/' element={<Home />} /> 
            <Route exact path='/dashboard' element={<ProtectedRoute element={<Dashboard />} />}/>

            <Route exact path='/about-us' element={<AboutUs />} /> 
            <Route exact path='/contact-us' element={<ContactUs />} /> 
            <Route exact path='/features' element={<Features />} /> 
            <Route exact path='/our-team' element={<OurTeam />} /> 
            <Route exact path='/pricing' element={<Pricing />} /> 
            <Route exact path='/solution' element={<Solution />} /> 
            <Route exact path='/who-we-are' element={<WhoWeAre />} /> 
            <Route exact path='/blog-list' element={<BlogList />} /> 
            <Route exact path='/terms-conditions' element={<TermsConditions />} /> 
            <Route exact path='/privacy-policy' element={<PrivacyPolicy />} /> 
          </Routes>
      </Router>
    </div>
  );
}

export default App;
