
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../../component/elements/context";
import { ApiService } from "../../component/services/apiservices";
import Header from "../../component/header";
const MyProfile = () => {
  const contextValues = useContext(DataContext)
  const navigate = useNavigate();
  const [successmsg, setsuccessmsg] = useState("");
  const [UserData, setUserData] = useState({});
  const [errormsg, seterrormessage] = useState("");
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (contextValues.rowUserData) {
      setUserData(contextValues.rowUserData)
    }
  }, [contextValues.rowUserData]);

  const handleUpdateInput = (e) => {
    seterrormessage("");
    const { name, value } = e.target;
    setUserData({
      ...UserData,
      [name]: value,
    });
  };
  const Profileupdate = (e) => {
    e.preventDefault();
    if (UserData?.user_name == "" || UserData?.user_name == null) {
      seterrormessage('error', "Please enter full name");
      return;
    }
    setisLoading(true);
    const dataString = {
      user_name: UserData?.user_name,
      user_dob: UserData?.user_dob,
      user_mobileno: UserData.user_mobileno,
      user_address: UserData.user_address
    };
    ApiService
      .postData('/update-profile', dataString)
      .then((res) => {
        if (res?.status == "success") {
          setisLoading(false);
          contextValues.setRowUserData(res?.data)
          setsuccessmsg(res.message)
          setTimeout(() => {
            window.location.reload()
          }, 500)
        } else if (res.status == 'error' && (res.message == 'session_expired' || res.message === 'Account Inactive' || res.message === 'User not found')) {
          localStorage.removeItem('USER_TOKEN')
          window.location.href = '/'
        }

        else {
          seterrormessage(res.message)
          setisLoading(false);
        }
      }).catch((error) => { });
  };
  const navigateback = (e) => {
    e.preventDefault()

    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };


  return (<>
    <Header />
    <div className="layout-wrap">
      <div className="main-content-inner">
        <div className="widget-box-2">
          <h6 className="title">My Profile</h6>
          {errormsg && (<div class="alert alert-danger" role="alert">{errormsg}</div>)}
          {successmsg && (<div class="alert alert-success" role="alert">{successmsg}</div>)}
          <div className="box grid-2 gap-30">
            <div className="box box-fieldset">
              <label htmlFor="user_fname">Full Name</label>
              <input
                className="form-control required"
                type="text"
                placeholder="Full Name"
                defaultValue={UserData?.user_name}
                name="user_name"
                onChange={(e) => {
                  handleUpdateInput(e);
                }}
              />
            </div>
            <div className="box box-fieldset">
              <label htmlFor="user_dob">Date Of Birth</label>
              <input
                className="form-control required"
                type="date"
                placeholder="Date Of Birth"
                defaultValue={UserData?.user_dob}
                name="user_dob"
                onChange={(e) => {
                  handleUpdateInput(e);
                }}
              />
            </div>
          </div>
          <div className="box grid-2 gap-30">
            <div className="box box-fieldset">
              <label htmlFor="user_email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                name="user_email"
                className="form-control required"
                placeholder="Email Address"
                value={UserData?.user_email}
                disabled={true}
                readOnly={true}
              />
            </div>
            <div className="box box-fieldset">
              <label htmlFor="user_mobileno" className="form-label">
                Mobile Number
              </label>
              <input
                type="number"
                name="user_mobileno"
                className="form-control required"
                placeholder="Mobile Number"
                value={UserData?.user_mobileno}
                onChange={(e) => {
                  handleUpdateInput(e);
                }}
              />
            </div>
          </div>
          <div className="box box-fieldset">
            <label htmlFor="user_address" className="form-label">
              Address
            </label>
            <input
              type="text"
              name="user_address"
              className="form-control required"
              placeholder="Address"
              value={UserData.user_address}
              onChange={(e) => {
                handleUpdateInput(e);
              }}
            />
          </div>
          <div className="box">
            <button className="tf-btn primary" type="button" name="submit" onClick={(e) => { Profileupdate(e); }} disabled={isLoading}>
              {isLoading ? (
                <img src="/img/loder01.gif" width="60px" height="11px" />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default MyProfile