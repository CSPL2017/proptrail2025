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
import MyProperty from './container/my_account/properties';
import MaintainnceTable from './container/property_purchase_forms/maintainence-table';
import CreateScenerio from './container/property_purchase_forms/create-scenerio';
import ScenerioDetail from './container/property_purchase_forms/scenerio-detail';
import MyProfile from './container/my_account/profile';
import TrackProperties from './container/my_account/track_properties';
import Strategies from './container/my_account/my_strategies';
import HelpSupport from './container/help_support';
import Pages from './container/pages';
import PageNotFound from './container/pages/page_not_found';
import BlogDetail from './container/blog/blog_detail';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />

          <Route exact path='/dashboard' element={<ProtectedRoute element={<Dashboard />} />} />
          <Route exact path='/my-property' element={<ProtectedRoute element={<MyProperty />} />} />
          <Route exact path='/maintainance/:id' activeClassName="active" element={<ProtectedRoute element={<MaintainnceTable />} />} />
          <Route exact path='/maintainance-edit/:id' activeClassName="active" element={<ProtectedRoute element={<MaintainnceTable />} />} />
          <Route exact path='/createscenerio/:id' activeClassName="active" element={<ProtectedRoute element={<CreateScenerio />} />} />
          <Route exact path='/scenerio/:id' activeClassName="active" element={<ProtectedRoute element={<ScenerioDetail />} />} />
          <Route exact path='/my-profile' activeClassName="active" element={<ProtectedRoute element={<MyProfile />} />} />
          <Route exact path='/track-my-property' activeClassName="active" element={<ProtectedRoute element={<TrackProperties />} />} />
          <Route exact path='/my-strategies' activeClassName="active" element={<ProtectedRoute element={<Strategies />} />} />
          <Route exact path='/help-support' activeClassName="active" element={<ProtectedRoute element={<HelpSupport />} />} />

          

          <Route exact path='/about-us' element={<AboutUs />} />
          <Route exact path='/contact-us' element={<ContactUs />} />
          <Route exact path='/features' element={<Features />} />
          <Route exact path='/our-team' element={<OurTeam />} />
          <Route exact path='/pricing' element={<Pricing />} />
          <Route exact path='/solution' element={<Solution />} />
          <Route exact path='/who-we-are' element={<WhoWeAre />} />
          <Route exact path='/news-blogs' element={<BlogList />} />
          <Route exact path='/blog-detail/:slug' activeClassName="active" element={<BlogDetail />} />
          <Route exact path='/terms-conditions' element={<TermsConditions />} />
          <Route exact path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route exact path='/error_404' activeClassName="active" element={<PageNotFound />} />
          <Route exact path='/:slug' activeClassName="active" element={<Pages />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
