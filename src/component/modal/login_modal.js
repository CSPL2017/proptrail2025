import React, { useState, useEffect } from "react";
import { ApiService } from "../services/apiservices";
import OtpInput from 'react-otp-input'
import { useForm, } from "react-hook-form"
import { GoogleLogin } from "@react-oauth/google";
import { toast } from 'react-toastify';
import { showToast } from "../utils/toast";
const LoginModal = ({ id = '', type }) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm();
    const [step, setStep] = useState(1)
    const [otp, setOtp] = useState('');
    const [showloader, setshowloader] = useState(false);
    const [userid, setuserid] = useState("")
    const userEmail = watch("verify_user_email")
    const userForgotEmail = watch("forget_user_email")
    const useraddress = watch("user_regisaddress")
    const username = watch("user_registname")
    const userdob = watch("user_regisdob")
    const usermobilenumber = watch("user_registmobileno")
    const [resendTimer, setResendTimer] = useState(30);

    const onSubmitregister = (data) => {
        if (data.user_registepassword !== data.user_resgisCpassword) {
            showToast("error", "Confirm Password not match with Password")
            return
        }
        setshowloader(true)
        const dataString = {
            user_name: username,
            user_mobileno: usermobilenumber,
            user_dob: userdob,
            user_address: useraddress,
            user_password: data?.user_registepassword,
            user_id: userid,
            property_id: id !== null && id !== '' ? id : ''

        }
        ApiService.postData('/user/getregister', dataString).then((res) => {
            if (res.status == "success") {
                let token = res.token
                localStorage.setItem("USER_TOKEN", token)
                showToast("success", res.message)
                setshowloader(false)
                if (id) {
                    window.location.reload()
                } else {
                    window.location.href = '/dashboard'
                }
            } else {
                showToast("error", res.message)
                setshowloader(false)
            }
        }).catch((error) => {
            setshowloader(false)
        })
    }


    useEffect(() => {
        if (type == 'signin') {
            setStep(1)
        }
        if (type == 'join') {
            setStep(2)
        }
    }, [type])

    useEffect(() => {
        const timerId = setInterval(() => {
            if (resendTimer > 0) {
                setResendTimer(resendTimer - 1);
            }
        }, 1000);
        return () => {
            clearInterval(timerId);
        };

    }, [resendTimer]);

    const continueregister = () => {
        setStep(5)
    }

    const gotologin = () => {
        setStep(1)
        setValue("user_email", " ")
        setValue("user_password", " ")
    }

    const gotoregister = (type) => {
        if (type == 'forget') {
            setStep(6)
            setValue('forget_user_email', '')
            setOtp('')

        }
        else {
            setStep(2)
            setValue("user_email", "")
            setValue('verify_user_email', ' ')
            setValue("user_registepassword", "")
            setValue("user_registname", "")
            setValue("user_registmobileno", "")
            setValue("user_regisaddress", "")
            setValue("user_regisdob", "")
            setOtp('')

        }
    }

    const onSubmitlogin = (data) => {
        setshowloader(true)
        const dataString = {
            user_email: data?.user_email,
            user_password: data?.user_password,
            property_id: id !== null && id !== '' ? id : ''
        }
        ApiService.postData('/user/getlogin', dataString).then((res) => {
            if (res.status == "success") {
                let token = res.token
                localStorage.setItem("USER_TOKEN", token);
                setshowloader(false)
                if (id) {
                    window.location.reload()
                } else {
                    window.location.href = '/dashboard'
                }
            } else {
                setshowloader(false)
                showToast("error", res.message)
            }
        }).catch((error) => {
            setshowloader(false)
        })

    }

    const onSubmitverifyotp = (data) => {
        if (otp == "") {
            showToast("error", "Otp is required")
            return
        }
        const dataString = {
            user_otp: otp,
            user_id: userid
        }
        setshowloader(true)
        ApiService.postData('/user/verifyotp', dataString).then((res) => {
            if (res.status == "success") {
                setuserid(res.id)
                showToast("success", res.message)
                setshowloader(false)
                setStep(4)
            } else {
                showToast("error", res.message)
                setshowloader(false)
            }
        }).catch((error) => { setshowloader(false) })
    }

    const onSubmitsendotp = (data) => {
        const checkemailpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data?.verify_user_email)
        if (!checkemailpattern) {
            showToast("error", "Email is not correct")
            return
        }
        const email = data?.verify_user_email.toLowerCase();
        const dataString = {
            user_email: email,
        }
        setshowloader(true)
        ApiService.postData('/user/sendotp', dataString).then((res) => {
            if (res.status == "success") {
                setuserid(res.id)
                showToast("success", res.message)
                setshowloader(false)
                setStep(3)
                setResendTimer(30);
            } else {
                showToast("error", res.message)
                setshowloader(false)
            }
        }).catch((error) => { setshowloader(false) })
    }

    const resendOTP = () => {
        setResendTimer(30);
        const dataString = {
            user_id: userid
        }
        ApiService.postData('/user/resendotp', dataString).then((res) => {
            if (res.status == "success") {
                showToast("success", res.message)
                setuserid(res.id)
            } else {
                showToast("error", res.message)
            }
        }).catch(() => { setshowloader(false) })
    };

    const onforgetPassord = (data) => {
        setshowloader(true)
        const dataString = {
            user_email: data?.forget_user_email,
        }
        ApiService.postData('/user/forgetpassword', dataString).then((res) => {
            if (res.status == "success") {
                setuserid(res.user_id)
                setshowloader(false)
                setStep(7)
                setResendTimer(30);
            } else {
                showToast("error", res.message)
                setshowloader(false)
            }
        }).catch(() => { setshowloader(false) })
    }

    const onSubmitforgetOtp = (data) => {
        if (otp == "") {
            showToast("error", 'OTP is required')
            return
        }
        setshowloader(true)
        const dataString = {
            user_otp: otp,
            user_id: userid
        }
        ApiService.postData('/user/verifyforgetotp', dataString).then((res) => {
            if (res.status == "success") {
                setuserid(res?.id)
                showToast("success", res.message)
                setshowloader(false)
                setStep(8)
            } else {
                showToast("error", res.message)
                setshowloader(false)
            }
        }).catch(() => { setshowloader(false) })
    }

    const onChangePassword = (data) => {
        if (data.user_changepassword !== data.user_changeCpassword) {
            showToast("error", "Password not match with confirm password")
            return
        }
        const dataString = {
            user_id: userid,
            password: data.user_changepassword,
            confirmpass: data.user_changeCpassword
        }
        setshowloader(true)
        ApiService.postData('/user/changepassword', dataString).then((res) => {
            if (res.status == 'success') {
                setshowloader(false)
                showToast("success", res.message)
                setStep(1)
            } else {
                showToast("error", res.message)
                setshowloader(false)
            }
        }).catch(() => { setshowloader(false) })
    }

    const onClickforget = () => {
        setValue('forget_user_email', '')
        setValue('user_email', '')
        setValue('user_password', '')
        setValue('user_changeCpassword', '')
        setValue('user_changepassword', '')
        setOtp('')
        setStep(6)
    }

    const handleSuccess = (res) => {
        const dataString = {
            googletoken: res?.credential,
            property_id: id !== null && id !== '' ? id : ''
        }
        ApiService.postData('/user/loginwithgoogle', dataString).then((res) => {
            if (res.status == "success") {
                let token = res?.token
                localStorage.setItem("USER_TOKEN", token);
                if (id) {
                    window.location.reload()
                } else {
                    window.location.href = '/dashboard'
                }
            } else {
                showToast("error", res.message)
            }
        }).catch(() => { setshowloader(false) })

    }

    const handleloginfailed = (error) => {
        console.log(error, 'login failed')
        toast.error('Login Failed Please Try Again')
    }

    return (
        <div className="modal fade" id="modalLogin">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    {/* Login With Password */}
                    {step == 1 &&
                        <div className="flat-account bg-surface">
                            <div className="text-center mb-4">
                                <h6>Sign In</h6>
                                <p>Welcome back! Please signin to continue.</p>
                            </div>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onSubmitlogin)}>
                                <fieldset className="box-fieldset">
                                    <label>Email Address</label>
                                    <input type='email'  {...register("user_email", { required: true, })} name="user_email" className="form-control style-1"></input>
                                    {errors.user_email && errors.user_email.type === "required" && (
                                        <small className="text-danger">Email is required.</small>
                                    )}
                                </fieldset>
                                <fieldset className="box-fieldset">
                                    <label className="d-flex justify-content-between">Password  <a href="#" className="caption-1 text-primary" onClick={(e) => { e.preventDefault(); onClickforget() }}>Forgot password?</a></label>
                                    <div className="box-password">
                                        <input type="password" className="form-contact style-1 password-field" placeholder="" name="user_password"  {...register("user_password", { required: true, })} />
                                        <span className="show-pass">
                                            <i className="icon-pass icon-eye"></i>
                                            <i className="icon-pass icon-eye-off"></i>
                                        </span>
                                        {errors.user_password && errors.user_password.type === "required" && (
                                            <small className="text-danger">Password is required.</small>
                                        )}
                                    </div>
                                </fieldset>
                                <button type="submit" className="tf-btn primary w-100 mt-3" disabled={showloader}>{showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Login"
                                )}</button>
                                <div className="text-variant-1 auth-line">or sign in with</div>

                                <GoogleLogin
                                    text="signin_with" 
                                    onSuccess={handleSuccess}
                                    onError={() => handleloginfailed()}
                                />

                                <div className="mt-12 text-variant-1 text-center noti">Not registered yet?<a href="#" onClick={(e) => { e.preventDefault(); gotoregister() }} className="text-black fw-5">Sign Up</a> </div>
                            </form>
                        </div>
                    }
                    {/* Registration */}
                    {step == 2 &&
                        <div className="flat-account bg-surface">
                            <div className="text-center mb-4">
                                <h6 className="">Create an Account</h6>
                                <p>We will send you an Email to verify your Email Address</p>
                            </div>
                            <h5 className="title text-center"></h5>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onSubmitsendotp)}>
                                <fieldset className="box-fieldset">
                                    <label>Email Address</label>
                                    <input type='email'  {...register("verify_user_email", { required: true, })} name="verify_user_email" className="form-control style-1"></input>
                                    {errors.verify_user_email && errors.verify_user_email.type === "required" && (
                                        <small className="text-danger">Email is required.</small>
                                    )}
                                </fieldset>
                                <button type="submit" className="tf-btn primary w-100" disabled={showloader}>{showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Continue"
                                )}</button>
                                <div className="text-variant-1 auth-line">or sign up with</div>

                                <GoogleLogin
                                    text="signup_with" 
                                    onSuccess={handleSuccess}
                                    onError={() => handleloginfailed()}
                                />
                                <div className="mt-12 text-variant-1 text-center noti">Already have an account?<a href="#" onClick={(e) => { e.preventDefault(); gotologin() }} className="text-black fw-5">Login Here</a> </div>
                            </form>
                        </div>
                    }
                    {/* Register OTP */}
                    {step == 3 &&
                        <div className="flat-account bg-surface">
                            <h5 className="title text-center">Verify OTP</h5>
                            <p style={{ marginBottom: '20px' }}>We have sent a verification code to {userEmail} <a href='#' className='tx-primary' onClick={(e) => { e.preventDefault(); gotoregister() }}>Change</a></p>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onSubmitverifyotp)}>
                                <div className='formgroup otp-input' style={{ marginBottom: '20px' }}>
                                    <OtpInput
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={4}
                                        renderInput={(props) => <input {...props} />}
                                    />
                                </div>
                                <div className='formgroup'>
                                    {resendTimer === 0 ? (
                                        <p className=''>
                                            Did not receive OTP? <a href='#' className='tx-primary' onClick={(e) => { e.preventDefault(); resendOTP() }}>Resend OTP</a>
                                        </p>
                                    ) : (
                                        <p className=''>Resend code in {resendTimer} sec</p>
                                    )}
                                </div>
                                <button type="submit" className="tf-btn primary w-100" disabled={showloader}>{showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Continue"
                                )}</button>
                                <div className="mt-12 text-variant-1 text-center noti">Already have an account?<a href="#" onClick={(e) => { e.preventDefault(); gotologin() }} className="text-black fw-5">Login Here</a> </div>
                            </form>
                        </div>
                    }
                    {/* Register Personal Details */}
                    {step == 4 &&
                        <div className="flat-account bg-surface">
                            <h5 className="title text-center">Personal Details</h5>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(continueregister)}>
                                <fieldset className="box-fieldset">
                                    <label>Full Name<span>*</span>:</label>
                                    <input type='text' {...register("user_registname", { required: true, })} name="user_registname" className="form-control style-1"></input>
                                    {errors.user_registname && errors.user_registname.type === "required" && (<small className="text-danger">User Name is required.</small>)}
                                </fieldset>
                                <fieldset className="box-fieldset">
                                    <label>DOB<span>*</span>:</label>
                                    <input type='date' name="user_regisdob" {...register("user_regisdob", { required: true, })} className="form-control style-1"></input>
                                    {errors.user_regisdob && errors.user_regisdob.type === "required" && (<small className="text-danger">DOB is required.</small>)}
                                </fieldset>
                                <fieldset className="box-fieldset">
                                    <label>Mobile Number</label>
                                    <input type='number' name="user_registmobileno" {...register("user_registmobileno")} className="form-control style-1"></input>
                                </fieldset>
                                <fieldset className="box-fieldset">
                                    <label>Address</label>
                                    <input type='text' name="user_regisaddress" {...register("user_regisaddress")} className="form-control style-1"></input>
                                </fieldset>
                                <button type="submit" className="tf-btn primary w-100" disabled={showloader}>{showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Continue"
                                )}</button>
                                <div className="mt-12 text-variant-1 text-center noti">Already have an account?<a href="#" onClick={(e) => { e.preventDefault(); gotologin() }} className="text-black fw-5">Login Here</a> </div>
                            </form>
                        </div>
                    }
                    {/* Register Password */}
                    {step == 5 &&
                        <div className="flat-account bg-surface">
                            <h5 className="title text-center">Set Password</h5>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onSubmitregister)}>
                                <fieldset className="box-fieldset">
                                    <label for="pass">Password<span>*</span>:</label>
                                    <div className="box-password">
                                        <input type="password" className="form-contact style-1" placeholder="Password" name="user_registepassword"  {...register("user_registepassword", { required: true, })} />
                                        {errors.user_registepassword && errors.user_registepassword.type === "required" && (
                                            <small className="text-danger">Password is required.</small>
                                        )}
                                    </div>
                                </fieldset>
                                <fieldset className="box-fieldset">
                                    <label for="pass">Confirm Password<span>*</span>:</label>
                                    <div className="box-password">
                                        <input type="password" className="form-contact style-1" placeholder="Password" name="user_resgisCpassword"  {...register("user_resgisCpassword", { required: true, })} />
                                        {errors.user_resgisCpassword && errors.user_resgisCpassword.type === "required" && (
                                            <small className="text-danger">Confirm Password is required.</small>
                                        )}
                                    </div>
                                </fieldset>
                                <button type="submit" className="tf-btn primary w-100" disabled={showloader}>{showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Register"
                                )}</button>
                                <div className="mt-12 text-variant-1 text-center noti">Already have an account?<a href="#" onClick={(e) => { e.preventDefault(); gotologin() }} className="text-black fw-5">Login Here</a> </div>
                            </form>
                        </div>
                    }
                    {/* Forgot Password */}
                    {step == 6 &&
                        <div className="flat-account bg-surface">
                            <div className="text-center mb-4">
                                <h6 className="">Forget Password</h6>
                                <p>Please enter your register email address</p>
                            </div>

                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onforgetPassord)}>
                                <fieldset className="box-fieldset">

                                    <input placeholder="Enter email address" type='email'  {...register("forget_user_email", { required: true, })} name="forget_user_email" className="form-control style-1"></input>
                                    {errors.forget_user_email && errors.forget_user_email.type === "required" && (
                                        <small className="text-danger">Email address is required.</small>
                                    )}
                                </fieldset>
                                <button type="submit" className="tf-btn primary w-100" disabled={showloader}>{showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Continue"
                                )}</button>
                            </form>
                        </div>
                    }
                    {/* Forgot Verify OTP */}
                    {step == 7 &&
                        <div className="flat-account bg-surface">
                            <h5 className="title text-center">Verify OTP</h5>
                            <p style={{ marginBottom: '20px' }}>We have sent a verification code to {userForgotEmail} <a href='#' className='tx-primary' onClick={(e) => { e.preventDefault(); gotoregister('forget') }}>Change</a></p>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onSubmitforgetOtp)}>
                                <div className='formgroup otp-input' style={{ marginBottom: '20px' }}>
                                    <OtpInput
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={4}
                                        renderInput={(props) => <input {...props} />}
                                    />
                                </div>
                                <div className='formgroup'>
                                    {resendTimer === 0 ? (
                                        <p className=''>
                                            Did not receive OTP? <a href='#' className='tx-primary' onClick={(e) => { e.preventDefault(); resendOTP() }}>Resend OTP</a>
                                        </p>
                                    ) : (
                                        <p className=''>Resend code in {resendTimer} sec</p>
                                    )}
                                </div>
                                <button type="submit" className="tf-btn primary w-100" disabled={showloader}>{showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Continue"
                                )}</button>
                            </form>
                        </div>
                    }
                    {/* Forgot Password */}
                    {step == 8 &&
                        <div className="flat-account bg-surface">
                            <h5 className="title text-center">Set Password</h5>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onChangePassword)}>
                                <fieldset className="box-fieldset">
                                    <label for="pass">Password<span>*</span>:</label>
                                    <div className="box-password">
                                        <input type="password" className="form-contact style-1" placeholder="Password" name="user_changepassword"  {...register("user_changepassword", { required: true, })} />
                                        {errors.user_changepassword && errors.user_changepassword.type === "required" && (
                                            <small className="text-danger">Password is required.</small>
                                        )}
                                    </div>
                                </fieldset>
                                <fieldset className="box-fieldset">
                                    <label for="pass">Confirm Password<span>*</span>:</label>
                                    <div className="box-password">
                                        <input type="password" className="form-contact style-1" placeholder="Password" name="user_changeCpassword"  {...register("user_changeCpassword", { required: true, })} />
                                        {errors.user_changeCpassword && errors.user_changeCpassword.type === "required" && (
                                            <small className="text-danger">Confirm Password is required.</small>
                                        )}
                                    </div>
                                </fieldset>
                                <button type="submit" className="tf-btn primary w-100" disabled={showloader}>{showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Change"
                                )}</button>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default LoginModal