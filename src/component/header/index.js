import React, { useState, useEffect, useRef, useContext } from "react";
import LoginModal from "../modal/login_modal"
import { useLocation, useNavigate } from "react-router-dom";
import DataContext from "../elements/context";
import { ApiService } from "../services/apiservices";
import SweetAlert from "react-bootstrap-sweetalert";

const Header = () => {
    let getusertoken = localStorage.getItem("USER_TOKEN")
    const contextValues = useContext(DataContext)
    const [type, settype] = useState('signin')
    const [id, setid] = useState('')
    const didMountRef = useRef(true);
    const [show, setShow] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();
    const { pathname } = location;

    const isActive = (path) => (pathname === path ? "current" : "");
    useEffect(() => {
        document.body.classList.add("bg-surface");
        if (didMountRef.current) {
            if (getusertoken) {
                getUserdatadetail()
            }
        }
        didMountRef.current = false;
    }, [])

    const getUserdatadetail = () => {
        ApiService.fetchData("/user-detail").then((res) => {
            if (res?.status == "success") {
                contextValues.setRowUserData(res?.userData);
            }
            else if (res.status == 'error' && (res.message == 'session_expired' || res.message == 'Account Inactive')) {
                localStorage.removeItem('USER_TOKEN')
                window.location.href = '/'

            }
        }).catch((error) => { })
    }

    const logOut = () => {
        setShow(true);
    };

    const Confirm = () => {
        localStorage.removeItem("USER_TOKEN")
        navigate("/");
        window.location.reload()
    };

    const Cancelalert = () => {
        setShow(false);
    };
    return (<>
        <header className="main-header fixed-header header-dashboard">
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
                                            <li className={`home ${isActive("/")}`}><a href="/">Home</a></li>
                                            <li className={`dropdown2 ${["/about-us", "/who-we-are", "/our-team"].includes(pathname) ? "current" : ""}`}><a href="#">Company</a>
                                                <ul>
                                                    <li><a href="/about-us">About Us</a></li>
                                                    <li><a href="/who-we-are">Who We Are</a></li>
                                                    <li><a href="/our-team">Our Team</a></li>
                                                </ul>
                                            </li>
                                            <li className={isActive("/features")}><a href="/features">Features</a></li>
                                            <li className={isActive("/solution")}><a href="/solution">Solution</a></li>
                                            <li className={isActive("/pricing")}><a href="/pricing">Pricing</a></li>
                                            <li className={`dropdown2 ${pathname === "/news-blogs" ? "current" : ""}`}><a href="#">Resources</a>
                                                <ul>
                                                    <li><a href="/news-blogs">Blogs</a></li>
                                                </ul>
                                            </li>
                                            <li className={isActive("/contact-us")}><a href="/contact-us">Contact Us</a></li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                            {getusertoken == null ?
                                <div className="header-account">
                                    <div className="register">
                                        <ul className="d-flex">
                                            <li><a href="#modalLogin" data-bs-toggle="modal" onClick={() => { settype('signin') }}>Login</a></li>
                                            <li>/</li>
                                            <li><a href="#modalLogin" data-bs-toggle="modal" onClick={() => { settype('join') }}>Register</a></li>
                                        </ul>
                                    </div>
                                    <div className="flat-bt-top">
                                        <a className="tf-btn primary" href="#">List Property</a>
                                    </div>
                                </div>
                                :
                                <div className="header-account">
                                    <a href="#" className="box-avatar dropdown-toggle" data-bs-toggle="dropdown">
                                        <div className="avatar avt-40 round">
                                            <img src="/images/avatar/avt-2.png" alt="avt" />
                                        </div>
                                        <p className="name">{contextValues?.rowUserData?.user_name} <span class="icon icon-arr-down"></span></p>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard') }}>Dashboards</a>
                                            <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navigate('/my-property') }}>My Properties</a>
                                            <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navigate('/my-profile') }}>My Profile</a>
                                            <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navigate('/track-my-property') }}>Track Properties</a>
                                            <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navigate('/my-strategies') }}>My Strategy</a>
                                            <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navigate('/help-support') }}>Help & Support</a>
                                            <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); logOut(); }}>Logout</a>
                                        </div>
                                    </a>
                                    <div className="flat-bt-top">
                                        <a className="tf-btn primary" href="add-property.html">List Property</a>
                                    </div>
                                </div>

                            }
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
                    </div>
                </nav>
            </div>
        </header>
        <LoginModal id={id} type={type} />
        <SweetAlert
            warning
            confirmBtnCssClass="alertpop"
            title={` Are you sure you want to Logout ? `}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            show={show}
            onConfirm={Confirm}
            onCancel={Cancelalert}
            btnSize="md"
            showCancel
            cancelBtnBsStyle="danger"
        ></SweetAlert>
    </>)
}

export default Header