import React, { useState, useEffect, useRef, useContext } from "react";
import LoginModal from "../modal/login_modal"

const Header = () => {
    const [type, settype] = useState('signin')
    const [id, setid] = useState('')
    return (<>
        <header className="main-header fixed-header">
            <div className="header-lower">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="inner-container d-flex justify-content-between align-items-center">
                            <div className="logo-box flex">
                                <div className="logo"><a href="/"><img src="/img/logo.png" alt="logo" width="174" height="44" /></a></div>
                            </div>
                            <div className="nav-outer">
                                <nav className="main-menu show navbar-expand-md">
                                    <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
                                        <ul className="navigation clearfix">
                                            <li className="home current"><a href="/">Home</a></li>
                                            <li className="dropdown2"><a href="#">Company</a>
                                                <ul>
                                                    <li><a href="/about-us">About Us</a></li>
                                                    <li><a href="/who-we-are">Who We Are</a></li>
                                                    <li><a href="/our-team">Our Team</a></li>
                                                </ul>
                                            </li>
                                            <li className=""><a href="/features">Features</a></li>
                                            <li className=""><a href="/solution">Solution</a></li>
                                            <li className=""><a href="/pricing">Pricing</a></li>
                                            <li className="dropdown2"><a href="#">Resources</a>
                                                <ul>
                                                    <li><a href="/blog-list">Blogs</a></li>
                                                </ul>
                                            </li>
                                            <li className=""><a href="/contact-us">Contact Us</a></li>
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
                    <div className="nav-logo"><a href="/"><img src="/img/logo.png" alt="nav-logo" width="174" height="44" /></a></div>
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
        <LoginModal id={id} type={type}/>
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