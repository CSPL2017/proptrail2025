import { ApiService } from "../services/apiservices";
import OtpInput from 'react-otp-input'
import React, { useState, useEffect } from "react";
import { useForm, } from "react-hook-form"
// import { GoogleLogin } from "@react-oauth/google";
import { toast } from 'react-toastify';
import { showToast } from "../utils/toast";
const LoginModal = ({ id = '', type }) => {
    let apiServices = new ApiService()
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
        apiServices.getuserregister(dataString).then((res) => {
            if (res.data.status == "success") {
                let token = res?.data?.token
                localStorage.setItem("USER_TOKEN", token)
                showToast("success", res.data.message)
                setshowloader(false)
                if (id) {
                    window.location.reload()
                } else {
                    window.location.href = '/dashboard'
                }
            } else {
                showToast("error", res.data.message)
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
        apiServices.getuserlogin(dataString).then((res) => {
            if (res.data.status == "success") {
                let token = res?.data?.token
                localStorage.setItem("USER_TOKEN", token);
                setshowloader(false)
                if (id) {
                    window.location.reload()
                } else {
                    window.location.href = '/dashboard'
                }
            } else {
                setshowloader(false)
                showToast("error", res.data.message)
            }
        }).catch(() => { })

    }

    const onSubmitverifyotp = (data) => {
        if (otp == "") {
            showToast("error", "Otp is required")
            return
        }

        setshowloader(true)
        const dataString = {
            user_otp: otp,
            user_id: userid
        }

        apiServices.gettoverifyotp(dataString).then((res) => {
            if (res.data.status == "success") {
                setuserid(res?.data?.id)
                showToast("success", res.data.message)
                setshowloader(false)
                setStep(4)
            } else {
                showToast("error", res.data.message)
                setshowloader(false)
            }
        }).catch((error) => { })

    }

    const onSubmitsendotp = (data) => {
        const checkemailpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data?.verify_user_email)
        if (!checkemailpattern) {
            showToast("error", "Email is not correct")
            return
        }
        else {
            const email = data?.verify_user_email.toLowerCase();
            const dataString = {
                user_email: email,
            }
            setshowloader(true)
            apiServices.gettosendotp(dataString).then((res) => {
                if (res.data.status == "success") {
                    setuserid(res?.data?.id)
                    showToast("success", res.data.message)
                    setshowloader(false)
                    setStep(3)
                    setResendTimer(30);
                } else {
                    showToast("error", res.data.message)
                    setshowloader(false)
                }
            }).catch((error) => {

            })
        }
    }

    const resendOTP = () => {
        setResendTimer(30);
        const dataString = {
            user_id: userid
        }
        apiServices.getresendotp(dataString).then((res) => {
            if (res.data.status == "success") {
                showToast("success", res.data.message)
                setuserid(res?.data?.id)
            } else {
                showToast("error", res.data.message)
            }
        }).catch(() => { })
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
                showToast("error", res.data.message)
                setshowloader(false)
            }
        }).catch(() => { })
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
        }).catch(() => { })
    }

    const resendforgetOTP = () => {
        setResendTimer(30);
        const dataString = {
            user_id: userid
        }
        ApiService.postData('/user/resendforgetotp', dataString).then((res) => {
            if (res.status == "success") {
                showToast("success", res.message)
                setuserid(res?.id)
            } else {
                showToast("error", res.message)
            }
        }).catch(() => { })
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
        })
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
            if (res.data.status == "success") {
                let token = res?.token
                localStorage.setItem("USER_TOKEN", token);
                if (id) {
                    window.location.reload()
                } else {
                    window.location.href = '/dashboard'
                }
            } else {
                showToast("error", res.data.message)
            }
        })

    }

    const handleloginfailed = (error) => {
        console.log(error, 'login failed')
        toast.error('Login Failed Please Try Again')
    }
    return (<>
        <div className="modal fade" id="modalLogin">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    {step == 1 &&
                        <div className="flat-account bg-surface">
                            <h3 className="title text-center">Log In</h3>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onSubmitlogin)}>
                                <fieldset className="box-fieldset">
                                    <label>Email<span>*</span>:</label>
                                    <input type='email'  {...register("user_email", { required: true, })} name="user_email" className="form-control style-1"></input>
                                    {errors.user_email && errors.user_email.type === "required" && (
                                        <small className="text-danger">Email is required.</small>
                                    )}
                                </fieldset>
                                <fieldset className="box-fieldset">
                                    <label for="pass">Password<span>*</span>:</label>
                                    <div className="box-password">
                                        <input type="password" className="form-contact style-1 password-field" placeholder="Password" name="user_password"  {...register("user_password", { required: true, })} />
                                        <span className="show-pass">
                                            <i className="icon-pass icon-eye"></i>
                                            <i className="icon-pass icon-eye-off"></i>
                                        </span>
                                        {errors.user_password && errors.user_password.type === "required" && (
                                            <small className="text-danger">Password is required.</small>
                                        )}
                                    </div>
                                </fieldset>
                                <div className="d-flex justify-content-between flex-wrap gap-12">
                                    <fieldset className="d-flex align-items-center gap-6">
                                        <input type="checkbox" className="tf-checkbox style-2" id="cb1" />
                                        <label for="cb1" className="caption-1 text-variant-1">Remember me</label>
                                    </fieldset>
                                    <a href="#" className="caption-1 text-primary" onClick={(e) => { e.preventDefault(); onClickforget() }}>Forgot password?</a>
                                </div>
                                <div className="text-variant-1 auth-line">or sign up with</div>
                                <div className="login-social">
                                    <a href="#" className="btn-login-social">
                                        <img src="/images/logo/google.webp" alt="img" />
                                        Continue with Google
                                    </a>
                                </div>
                                <button type="submit" className="tf-btn primary w-100" disabled={showloader}>{showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Login"
                                )}</button>
                                <div className="mt-12 text-variant-1 text-center noti">Not registered yet?<a href="#" onClick={(e) => { e.preventDefault(); gotoregister() }} className="text-black fw-5">Sign Up</a> </div>
                            </form>
                        </div>
                    }
                    {step == 2 &&
                        <div className="flat-account bg-surface">
                            <h3 className="title text-center">Create an Account</h3>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onSubmitsendotp)}>
                                <fieldset className="box-fieldset">
                                    <label>Email<span>*</span>:</label>
                                    <input type='email'  {...register("verify_user_email", { required: true, })} name="verify_user_email" className="form-control style-1"></input>
                                    {errors.verify_user_email && errors.verify_user_email.type === "required" && (
                                        <small className="text-danger">Email is required.</small>
                                    )}
                                </fieldset>
                                <button type="submit" className="tf-btn primary w-100" disabled={showloader}>{showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Verify"
                                )}</button>
                                <div className="mt-12 text-variant-1 text-center noti">Already have an account?<a href="#" onClick={(e) => { e.preventDefault(); gotologin() }} className="text-black fw-5">Login Here</a> </div>
                            </form>
                        </div>
                    }
                    {step == 3 &&
                        <div className="flat-account bg-surface">
                            <h3 className="title text-center">Verify Otp</h3>
                            <p>We have sent a verification code to {userEmail} <a href='#' className='tx-primary' onClick={(e) => { e.preventDefault(); gotoregister() }}>Change</a></p>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onSubmitverifyotp)}>
                                <div className='formgroup mb-20 otp-input' >
                                    <OtpInput
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={4}
                                        renderInput={(props) => <input {...props} />}
                                    />
                                </div>
                                <div className='formgroup mb-20'>
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
                    {step == 4 &&
                        <div className="flat-account bg-surface">
                            <h3 className="title text-center">Create an Account</h3>
                            <p>Please do the registration to continue.</p>
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
                    {step == 5 &&
                        <div className="flat-account bg-surface">
                            <h3 className="title text-center">Set Password</h3>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onSubmitregister)}>
                                <fieldset className="box-fieldset">
                                    <label for="pass">Password<span>*</span>:</label>
                                    <div className="box-password">
                                        <input type="password" className="form-contact style-1 password-field" placeholder="Password" name="user_registepassword"  {...register("user_registepassword", { required: true, })} />
                                        <span className="show-pass">
                                            <i className="icon-pass icon-eye"></i>
                                            <i className="icon-pass icon-eye-off"></i>
                                        </span>
                                        {errors.user_registepassword && errors.user_registepassword.type === "required" && (
                                            <small className="text-danger">Password is required.</small>
                                        )}
                                    </div>
                                </fieldset>
                                <fieldset className="box-fieldset">
                                    <label for="pass">Confirm Password<span>*</span>:</label>
                                    <div className="box-password">
                                        <input type="password" className="form-contact style-1 password-field" placeholder="Password" name="user_resgisCpassword"  {...register("user_resgisCpassword", { required: true, })} />
                                        <span className="show-pass">
                                            <i className="icon-pass icon-eye"></i>
                                            <i className="icon-pass icon-eye-off"></i>
                                        </span>
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
                    {step == 6 &&
                        <div className="flat-account bg-surface">
                            <h3 className="title text-center">Forget Password</h3>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onforgetPassord)}>
                                <fieldset className="box-fieldset">
                                    <label>Email<span>*</span>:</label>
                                    <input type='email'  {...register("forget_user_email", { required: true, })} name="forget_user_email" className="form-control style-1"></input>
                                    {errors.forget_user_email && errors.forget_user_email.type === "required" && (
                                        <small className="text-danger">Email is required.</small>
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
                    {step == 7 &&
                        <div className="flat-account bg-surface">
                            <h3 className="title text-center">Verify Otp</h3>
                            <p>We have sent a verification code to {userEmail} <a href='#' className='tx-primary' onClick={(e) => { e.preventDefault(); gotoregister() }}>Change</a></p>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onSubmitforgetOtp)}>
                                <div className='formgroup mb-20 otp-input' >
                                    <OtpInput
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={4}
                                        renderInput={(props) => <input {...props} />}
                                    />
                                </div>
                                <div className='formgroup mb-20'>
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
                    {step == 8 &&
                        <div className="flat-account bg-surface">
                            <h3 className="title text-center">Set Password</h3>
                            <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                            <form onSubmit={handleSubmit(onChangePassword)}>
                                <fieldset className="box-fieldset">
                                    <label for="pass">Password<span>*</span>:</label>
                                    <div className="box-password">
                                        <input type="password" className="form-contact style-1 password-field" placeholder="Password" name="user_changepassword"  {...register("user_changepassword", { required: true, })} />
                                        <span className="show-pass">
                                            <i className="icon-pass icon-eye"></i>
                                            <i className="icon-pass icon-eye-off"></i>
                                        </span>
                                        {errors.user_changepassword && errors.user_changepassword.type === "required" && (
                                            <small className="text-danger">Password is required.</small>
                                        )}
                                    </div>
                                </fieldset>
                                <fieldset className="box-fieldset">
                                    <label for="pass">Confirm Password<span>*</span>:</label>
                                    <div className="box-password">
                                        <input type="password" className="form-contact style-1 password-field" placeholder="Password" name="user_changeCpassword"  {...register("user_changeCpassword", { required: true, })} />
                                        <span className="show-pass">
                                            <i className="icon-pass icon-eye"></i>
                                            <i className="icon-pass icon-eye-off"></i>
                                        </span>
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
    </>)
}
export default LoginModal