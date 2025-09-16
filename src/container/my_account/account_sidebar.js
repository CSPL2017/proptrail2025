import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import DataContext from "../../component/elements/context";
import { ApiService } from "../../component/services/apiservices";
const Accountsidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const contextValues = useContext(DataContext)
    const [UserData, setUserData] = useState({});
    const [isloading, setIsLoading] = useState(false)
    const [show, setShow] = useState(false);

    const didMountRef = useRef(true);
    useEffect(() => {
        if (didMountRef.current) {
            getUserdatadetail()
        }
        didMountRef.current = false;
    }, [])
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

    const getUserdatadetail = () => {
        setIsLoading(true)
        ApiService.fetchData("/user-detail").then((res) => {
            if (res?.status == "success") {
                contextValues.setRowUserData(res?.userData);
                setUserData(res?.userData);
                setIsLoading(false)
            }
            else if (res.status == 'error' && (res.message == 'session_expired' || res.message == 'Account Inactive')) {
                localStorage.removeItem('USER_TOKEN')
                window.location.href = '/'
                setIsLoading(false)
            }
            else {
                setIsLoading(false)
            }
        }).catch((error) => { setIsLoading(false) })
    };

    return (
        <>
            <div className="sidebar-menu-dashboard">
                <ul className="box-menu-dashboard">
                    <li className={location?.pathname == "/dashboard" ? "nav-menu-item active" : "nav-menu-item"}>
                        <a className="nav-menu-link" href="/dashboard"><span className="icon icon-dashboard"></span> Dashboards</a>
                    </li>
                    <li className={location?.pathname == "/my-account" ? "nav-menu-item active" : "nav-menu-item"}>
                        <a className="nav-menu-link" href="/my-account"><span className="icon icon-list-dashes"></span>Account Overview</a>
                    </li>
                    <li className={location?.pathname == "/my-profile" ? "nav-menu-item active" : "nav-menu-item"}>
                        <a className="nav-menu-link" href="/my-profile"><span className="icon icon-file-text"></span> My Profile</a>
                    </li>
                    <li className={location?.pathname == "/track-my-property" ? "nav-menu-item active" : "nav-menu-item"}>
                        <a className="nav-menu-link" href="/track-my-property"><span className="icon icon-heart"></span>Track Properties</a>
                    </li>
                    <li className={location?.pathname == "/my-strategies" ? "nav-menu-item active" : "nav-menu-item"}>
                        <a className="nav-menu-link" href="/my-strategies"><span className="icon icon-review"></span> My Strategy</a>
                    </li>
                    <li className={location?.pathname == "/my-property" ? "nav-menu-item active" : "nav-menu-item"}>
                        <a className="nav-menu-link" href="/my-property"><span className="icon icon-profile"></span> My Properties</a>
                    </li>
                    <li className={location?.pathname == "/help-support" ? "nav-menu-item active" : "nav-menu-item"}>
                        <a className="nav-menu-link" href="/help-support"><span className="icon icon-profile"></span> Help & Support</a>
                    </li>
                    <li className="nav-menu-item"><a className="nav-menu-link" href="#" onClick={(e) => { e.preventDefault(); logOut(); }}><span className="icon icon-sign-out"></span> Logout</a></li>
                </ul>
            </div> 
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
        </>
    );
};

export default Accountsidebar;
