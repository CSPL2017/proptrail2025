const Header = () => {
    return (<>
        <header className="main-header fixed-header">
            <div className="header-lower">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="inner-container d-flex justify-content-between align-items-center">
                            <div className="logo-box flex">
                                <div className="logo"><a href="index.html"><img src="images/logo/logo@2x.png" alt="logo" width="174" height="44" /></a></div>
                            </div>
                            <div className="nav-outer">
                                <nav className="main-menu show navbar-expand-md">
                                    <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
                                        <ul className="navigation clearfix">
                                            <li className="dropdown2 home current"><a href="#">Home</a>
                                                <ul>
                                                    <li><a href="index.html">Homepage 01</a></li>
                                                    <li className="current"><a href="home-02.html">Homepage 02</a></li>
                                                    <li><a href="home-03.html">Homepage 03</a></li>
                                                    <li><a href="home-04.html">Homepage 04</a></li>
                                                    <li><a href="home-05.html">Homepage 05</a></li>
                                                    <li><a href="home-06.html">Homepage 06</a></li>

                                                </ul>
                                            </li>
                                            <li className="dropdown2"><a href="#">Listing</a>
                                                <ul>
                                                    <li><a href="property-halfmap-grid.html">Property Half Map Grid</a></li>
                                                    <li><a href="property-halfmap-list.html">Property Half Map List</a></li>
                                                    <li><a href="topmap-grid.html">Find Topmap Grid</a></li>
                                                    <li><a href="topmap-list.html">Find Topmap List</a></li>
                                                    <li><a href="sidebar-grid.html">Find Sidebar Grid</a></li>
                                                    <li><a href="sidebar-list.html">Find Sidebar List</a></li>

                                                </ul>
                                            </li>
                                            <li className="dropdown2"><a href="#">Properties</a>
                                                <ul>
                                                    <li><a href="property-details-v1.html">Property Details 1</a></li>
                                                    <li><a href="property-details-v2.html">Property Details 2</a></li>
                                                    <li><a href="property-details-v3.html">Property Details 3</a></li>
                                                    <li><a href="property-details-v4.html">Property Details 4</a></li>
                                                </ul>
                                            </li>
                                            <li className="dropdown2"><a href="#">Pages</a>
                                                <ul>
                                                    <li><a href="about-us.html">About Us</a></li>
                                                    <li><a href="our-service.html">Our Services</a></li>
                                                    <li><a href="pricing.html">Pricing</a></li>
                                                    <li><a href="contact.html">Contact Us</a></li>
                                                    <li><a href="faq.html">FAQs</a></li>
                                                    <li><a href="privacy-policy.html">Privacy Policy</a></li>
                                                    <li><a href="icon.html">Icons</a></li>

                                                </ul>
                                            </li>
                                            <li className="dropdown2"><a href="#">Blog</a>
                                                <ul>
                                                    <li><a href="blog.html">Blog Default</a></li>
                                                    <li><a href="blog-grid.html">Blog Grid</a></li>
                                                    <li><a href="blog-detail.html">Blog Post Details</a></li>
                                                </ul>
                                            </li>

                                            <li className="dropdown2"><a href="#">Dashboard</a>
                                                <ul>
                                                    <li><a href="dashboard.html">Dashboard</a></li>
                                                    <li><a href="my-favorites.html">My Properties</a></li>
                                                    <li><a href="my-invoices.html">My Invoices</a></li>
                                                    <li><a href="my-favorites.html">My Favorites</a></li>
                                                    <li><a href="reviews.html">Reviews</a></li>
                                                    <li><a href="my-profile.html">My Profile</a></li>
                                                    <li><a href="add-property.html">Add Property</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                            <div className="header-account">
                                <div className="register">
                                    <ul className="d-flex">
                                        <li><a href="#modalLogin" data-bs-toggle="modal">Login</a></li>
                                        <li>/</li>
                                        <li><a href="#modalRegister" data-bs-toggle="modal">Register</a></li>
                                    </ul>
                                </div>
                                <div className="flat-bt-top">
                                    <a className="tf-btn primary" href="add-property.html">Submit Property</a>
                                </div>
                            </div>

                            <div className="mobile-nav-toggler mobile-button"><span></span></div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="close-btn"><span className="icon flaticon-cancel-1"></span></div>
            <div className="mobile-menu">
                <div className="menu-backdrop"></div>
                <nav className="menu-box">
                    <div className="nav-logo"><a href="index.html"><img src="images/logo/logo@2x.png" alt="nav-logo" width="174" height="44" /></a></div>
                    <div className="bottom-canvas">
                        <div className="login-box">
                            <a href="#modalLogin" data-bs-toggle="modal">Login</a>
                            <span>/</span>
                            <a href="#modalRegister" data-bs-toggle="modal">Register</a>
                        </div>
                        <div className="menu-outer"></div>
                        <div className="button-mobi-sell">
                            <a className="tf-btn primary" href="add-property.html">Submit Property</a>
                        </div>
                        <div className="mobi-icon-box">
                            <div className="box d-flex align-items-center">
                                <span className="icon icon-phone2"></span>
                                <div>1-333-345-6868</div>
                            </div>
                            <div className="box d-flex align-items-center">
                                <span className="icon icon-mail"></span>
                                <div>themesflat@gmail.com</div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
        <div className="modal fade" id="modalLogin">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="flat-account bg-surface">
                        <h3 className="title text-center">Log In</h3>
                        <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                        <form action="#">
                            <fieldset className="box-fieldset">
                                <label for="name">Your Names<span>*</span>:</label>
                                <input type="text" className="form-contact style-1" value="themesflat@gmail.com|" />
                            </fieldset>
                            <fieldset className="box-fieldset">
                                <label for="pass">Password<span>*</span>:</label>
                                <div className="box-password">
                                    <input type="password" className="form-contact style-1 password-field" placeholder="Password" />
                                    <span className="show-pass">
                                        <i className="icon-pass icon-eye"></i>
                                        <i className="icon-pass icon-eye-off"></i>
                                    </span>
                                </div>
                            </fieldset>
                            <div className="d-flex justify-content-between flex-wrap gap-12">
                                <fieldset className="d-flex align-items-center gap-6">
                                    <input type="checkbox" className="tf-checkbox style-2" id="cb1" />
                                    <label for="cb1" className="caption-1 text-variant-1">Remember me</label>
                                </fieldset>
                                <a href="#" className="caption-1 text-primary">Forgot password?</a>
                            </div>
                            <div className="text-variant-1 auth-line">or sign up with</div>
                            <div className="login-social">
                                <a href="#" className="btn-login-social">
                                    <img src="images/logo/fb.jpg" alt="img" />
                                    Continue with Facebook
                                </a>
                                <a href="#" className="btn-login-social">
                                    <img src="images/logo/google.jpg" alt="img" />
                                    Continue with Google
                                </a>
                                <a href="#" className="btn-login-social">
                                    <img src="images/logo/tw.jpg" alt="img" />
                                    Continue with Twitter
                                </a>
                            </div>
                            <button type="submit" className="tf-btn primary w-100">Login</button>
                            <div className="mt-12 text-variant-1 text-center noti">Not registered yet?<a href="#modalRegister" data-bs-toggle="modal" className="text-black fw-5">Sign Up</a> </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {/* popup register  */}
        <div className="modal fade" id="modalRegister">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="flat-account bg-surface">
                        <h3 className="title text-center">Register</h3>
                        <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                        <form action="#">
                            <fieldset className="box-fieldset">
                                <label for="name">Username or email address<span>*</span>:</label>
                                <input type="text" className="form-contact style-1" value="themesflat@gmail.com|" />
                            </fieldset>
                            <fieldset className="box-fieldset">
                                <label for="pass">Password<span>*</span>:</label>
                                <div className="box-password">
                                    <input type="password" className="form-contact style-1 password-field" placeholder="Password" />
                                    <span className="show-pass">
                                        <i className="icon-pass icon-eye"></i>
                                        <i className="icon-pass icon-eye-off"></i>
                                    </span>
                                </div>
                            </fieldset>
                            <fieldset className="box-fieldset">
                                <label for="confirm">Confirm Password<span>*</span>:</label>
                                <div className="box-password">
                                    <input type="password" className="form-contact style-1 password-field2" placeholder="Password" />
                                    <span className="show-pass2">
                                        <i className="icon-pass icon-eye"></i>
                                        <i className="icon-pass icon-eye-off"></i>
                                    </span>
                                </div>
                            </fieldset>
                            <fieldset className="d-flex align-items-center gap-6">
                                <input type="checkbox" className="tf-checkbox style-2" id="cb1" />
                                <label for="cb1" className="caption-1 text-variant-1">I agree to the <span className="fw-5 text-black">Terms of User</span></label>
                            </fieldset>

                            <button type="submit" className="tf-btn primary w-100">Register</button>
                            <div className="mt-12 text-variant-1 text-center noti">Already have an account?<a href="#modalLogin" data-bs-toggle="modal" className="text-black fw-5">Login Here</a> </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Header