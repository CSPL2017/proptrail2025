import { ApiService } from "../services/apiservices";
import OtpInput from 'react-otp-input'
import React, { useState, useEffect } from "react";
import { useForm, } from "react-hook-form"
// import { GoogleLogin } from "@react-oauth/google";
import { toast } from 'react-toastify';
import { showToast } from "../utils/toast";
const LoginModal = ({ id='', type }) => {
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
    const [showgoogleloader, setshowgoogleloader] = useState(false);
    const [userid, setuserid] = useState("")
    const userEmail = watch("verify_user_email")
    const useraddress = watch("user_regisaddress")
    const username = watch("user_registname")
    const userdob = watch("user_regisdob")
    const usermobilenumber = watch("user_registmobileno")
    const [errormsg, setErrorMessage] = useState("");
    const [successmsg, setSuccessMessage] = useState("");
    const [resendTimer, setResendTimer] = useState(30);


    const onSubmitregister = (data) => {
        if (data.user_registepassword !== data.user_resgisCpassword) {
            setErrorMessage("Confirm Password not match with Password")
            return
        }
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
                setSuccessMessage(res?.data?.message)
                setshowloader(false)
                if (id) {
                    window.location.reload()
                } else {
                    window.location.href = '/dashboard'
                }
                // setTimeout(() => {
                //     setshowlogin(false);
                // }, [2000])
            } else {
                const errormsg = res?.data?.message;
                setErrorMessage(errormsg)
                setshowloader(false)
                // setTimeout(() => {
                //     setshowlogin(false);
                // }, [3000])
            }
        })
            .catch((error) => {
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
            setErrorMessage('')
            setStep(6)
            setValue('forget_user_email', '')
            setOtp('')

        }
        else {
            setErrorMessage('')
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
            console.log('res',res);
            
            if (res.data.status == "success") {
                let token = res?.data?.token
                localStorage.setItem("USER_TOKEN", token);
                setshowloader(false)
                /* if (id) {
                    window.location.reload()
                } else {
                    window.location.href = '/dashboard'
                } */
            } else {
                setshowloader(false)
                showToast('error',res.data.message) 
            }
        }).catch(() => { })

    }

    const onSubmitverifyotp = (data) => {

        if (otp == "") {
            setErrorMessage("Otp is required")
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
                setSuccessMessage(res?.data?.message)
                setTimeout(() => {
                    setshowloader(false)
                    setErrorMessage('')
                    setSuccessMessage('')
                    setStep(4)

                }, 1000)

            } else {
                const errormsg = res?.data?.message;
                setErrorMessage(errormsg)
                setshowloader(false)
                setTimeout(() => {
                    setErrorMessage('')
                    setSuccessMessage('')
                }, 1000)
            }
        }).catch((error) => { })

    }

    const onSubmitsendotp = (data) => {

        const checkemailpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data?.verify_user_email)
        if (!checkemailpattern) {
            setErrorMessage("Email is not correct")
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
                    setSuccessMessage(res?.data?.message)
                    setshowloader(false)

                    setTimeout(() => {
                        setErrorMessage('')
                        setSuccessMessage('')
                        setStep(3)
                        setResendTimer(30);
                    }, 1000)
                } else {
                    const errormsg = res?.data?.message;
                    setErrorMessage(errormsg)
                    setshowloader(false)
                    setTimeout(() => {
                        setErrorMessage('')
                        setSuccessMessage('')
                    }, 1000)
                }
            }).catch((error) => {

            })

        }
    }

    const resendOTP = () => {
        setErrorMessage('')
        setSuccessMessage('')
        setResendTimer(30);

        const dataString = {
            user_id: userid
        }

        apiServices.getresendotp(dataString).then((res) => {
            if (res.data.status == "success") {
                setSuccessMessage(res?.data?.message)
                setuserid(res?.data?.id)

            } else {

                const errormsg = res?.data?.message;
                setErrorMessage(errormsg)
                setTimeout(() => {
                    setErrorMessage('')
                    setSuccessMessage('')
                }, 1000)

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
                setTimeout(() => {
                    setuserid(res.user_id)
                    setshowloader(false)
                    setStep(7)
                }, [1000])
            } else {
                const errormsg = res?.message;
                setErrorMessage(errormsg)
                setshowloader(false)
                setTimeout(() => {
                    setErrorMessage('')
                }, 2000)

            }
        }).catch(() => { })
    }

    const onSubmitforgetOtp = (data) => {
        if (otp == "") {
            setErrorMessage("Otp is required")
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
                setSuccessMessage(res?.message)
                setTimeout(() => {
                    setshowloader(false)
                    setErrorMessage('')
                    setSuccessMessage('')
                    setStep(8)

                }, 1000)

            } else {
                const errormsg = res?.message;
                setErrorMessage(errormsg)
                setshowloader(false)
                setTimeout(() => {
                    setErrorMessage('')
                    setSuccessMessage('')
                }, 1000)
            }
        }).catch(() => { })
    }

    const resendforgetOTP = () => {
        setErrorMessage('')
        setSuccessMessage('')
        setResendTimer(30);
        const dataString = {
            user_id: userid
        }
        ApiService.postData('/user/resendforgetotp', dataString).then((res) => {
            if (res.status == "success") {
                setSuccessMessage(res?.message)
                setuserid(res?.id)
                setTimeout(() => {
                    setErrorMessage('')
                    setSuccessMessage('')
                }, 1000)

            } else {
                const errormsg = res?.message;
                setErrorMessage(errormsg)
                setTimeout(() => {
                    setErrorMessage('')
                    setSuccessMessage('')
                }, 1000)
            }
        }).catch(() => { })
    }

    const onChangePassword = (data) => {
        setshowloader(true)
        if (data.user_changepassword !== data.user_changeCpassword) {
            setErrorMessage('Password not match with confirm password')
            setshowloader(false)
            return
        }
        const dataString = {
            user_id: userid,
            password: data.user_changepassword,
            confirmpass: data.user_changeCpassword
        }
        ApiService.postData('/user/changepassword', dataString).then((res) => {
            if (res.status == 'success') {
                setshowloader(false)
                setSuccessMessage(res?.message)
                setTimeout(() => {
                    setErrorMessage('')
                    setSuccessMessage('')
                    setStep(1)
                }, 1000)

            }
            else {
                const errormsg = res?.message;
                setErrorMessage(errormsg)
                setshowloader(false)
                setTimeout(() => {
                    setErrorMessage('')
                    setSuccessMessage('')
                }, 1000)
            }
        })
    }

    const onClickforget = () => {
        setErrorMessage('')
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
                const errormsg = res?.message;
                setErrorMessage(errormsg)
                setTimeout(() => {
                    setErrorMessage('')
                }, 2000)

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
                                    <label for="name">Email<span>*</span>:</label>
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
                                <div className="mt-12 text-variant-1 text-center noti">Not registered yet?<a href="#modalRegister" data-bs-toggle="modal" className="text-black fw-5">Sign Up</a> </div>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </div>
    </>)
}
export default LoginModal