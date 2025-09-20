import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Header from "../../component/header";
import { ApiService } from "../../component/services/apiservices";

const Strategies = () => {
    const [showloader, setshowloader] = useState(false)
    const [strategyId, setstrategyId] = useState('')
    const didMountRef = useRef(true)
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const Navigate = useNavigate()

    const submitStrategy = (data) => {
        let dataString = {}
        if (strategyId) {
            dataString = { ...data, staretegy_id: strategyId }
        } else {
            dataString = data
        }
        setshowloader(true)
        ApiService.postData('/property/createpropertystrategy', dataString).then(res => {
            if (res.status == "success") {
                setshowloader(false)
                toast.success(res.data.message)
                Navigate('/dashboard')
            } else if (res?.status == "error" && (res.message == 'session_expired' || res.message === 'User not found')) {
                toast.error(res?.message)
                localStorage.removeItem("USER_TOKEN")
                setshowloader(false)
                Navigate('/')
            } else if (res?.status === "error") {
                toast.error(res?.message);
                setshowloader(false);
            } else {
                toast.error(res?.message);
                setshowloader(false);
            }
        }).catch((error) => {
            setTimeout(() => {
                setshowloader(false)
            }, 500)
        })
    }
    useEffect(() => {
        if (didMountRef.current) {
            getUserDetail()
            fetchStretegydetail()
        }
        didMountRef.current = false;
    })

    const fetchStretegydetail = async () => {
        await ApiService.fetchData('/property/getstrategydetail').then(res => {
            if (res.status == "success") {
                if (res?.data) {
                    const data = res.data
                    setstrategyId(data._id)
                    setValue("stra_user_current_inc", data?.stra_user_current_inc);
                    setValue("stra_user_cash_position", data?.stra_user_cash_position);
                    setValue("stra_user_monthly_exp", data?.stra_user_monthly_exp);
                    setValue("stra_budget", data?.stra_budget);
                    setValue("stra_equity_target", data?.stra_equity_target);
                    setValue("stra_annual_cashflow_target", data?.stra_annual_cashflow_target);
                    setValue("stra_equity_target_achieve", data?.stra_equity_target_achieve);
                    setValue("stra_cashflow_target_achieve", data?.stra_cashflow_target_achieve);
                    setValue("stra_risk_app", data?.stra_risk_app);
                    setValue("stra_lower_budget", data?.stra_lower_budget);
                    setValue("stra_upper_budget", data?.stra_upper_budget);
                }
            } else if (res.status === 'error' && (res.message === 'session_expired' || res.message === 'Account Inactive')) {
                localStorage.removeItem('USER_TOKEN')
                Navigate('/')
            } else {
                toast.error(res?.message);
            }
        }).catch((errors) => { })
    }

    const getUserDetail = async () => {
        await ApiService.fetchData("/user-detail").then((res) => {
            console.log(res, 'resres')
            if (res?.status == "success") {
                setValue("stra_user_name", res.userData.user_name);
            }
            else if (res.status === 'error' && (res.message === 'session_expired' || res.message === 'Account Inactive')) {
                localStorage.removeItem('USER_TOKEN')
                Navigate('/')
            }
        }).catch((error) => { })
    }

    return (
        <>
            <Header/>
            <div className="layout-wrap">
                <div className="main-content-inner">
                    <div className="widget-box-2">
                        <form onSubmit={handleSubmit(submitStrategy)}>
                            <h5 className="pt-3 pb-3">Customer Details</h5>
                            <div>
                                <div className="row g-3">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>What is your Name ? </label>
                                            <input type="text" name="stra_user_name" {...register("stra_user_name", { required: true, })} disabled={true} />
                                            {errors.stra_user_name && errors.stra_user_name.type === "required" && (
                                                <small className="text-danger">User Name is required.</small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>What is your current income ?</label>
                                            <input type='number' step="any" name="stra_user_current_inc" {...register("stra_user_current_inc", { required: true, })} />
                                        </div>
                                        {errors.stra_user_current_inc && errors.stra_user_current_inc.type === "required" && (
                                            <small className="text-danger">Current Income is required.</small>
                                        )}
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>What are your monthly expenses ?</label>
                                            <input type='text' name="stra_user_monthly_exp" {...register("stra_user_monthly_exp")} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>What are your cash position ?</label>
                                            <input type='text' name="stra_user_cash_position" {...register("stra_user_cash_position")} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h5 className="pt-3 pb-3">Customer Strategies</h5>
                            <div>
                                <div className="row g-3">
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>What is your Budget?</label>
                                            <input type="number" name="stra_budget" {...register("stra_budget", { required: "Budget is required.", })} className="form-control" />
                                            {errors.stra_budget && (
                                                <small className="text-danger">{errors.stra_budget.message}</small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label >What is the lower limmit of the Budget?</label>
                                            <input type="text" name="stra_lower_budget" {...register("stra_lower_budget", { required: true, })} />
                                            {errors.stra_lower_budget && errors.stra_lower_budget.type === "required" && (
                                                <small className="text-danger">Lower limmit is required.</small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label >What is the Upper limit of the Budget?</label>
                                            <input type="text" name="stra_upper_budget" {...register("stra_upper_budget", { required: true, })} />
                                            {errors.stra_upper_budget && errors.stra_upper_budget.type === "required" && (
                                                <small className="text-danger">Upper limit is required.</small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>What is your Equity target for the property ?</label>
                                            <input type='number' name="stra_equity_target" {...register("stra_equity_target", { required: true, })} />
                                        </div>
                                        {errors.stra_equity_target && errors.stra_equity_target.type === "required" && (
                                            <small className="text-danger">Equity Target is required.</small>
                                        )}
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>How soon do you want to achieve your equity target ?</label>
                                            <input type='number' name="stra_equity_target_achieve" {...register("stra_equity_target_achieve", { required: true, })} />
                                        </div>
                                        {errors.stra_equity_target_achieve && errors.stra_equity_target_achieve.type === "required" && (
                                            <small className="text-danger">Equity target achieve year is required.</small>
                                        )}
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>What is your Annual Cashflow target for the property ?</label>
                                            <input type='number' name="stra_annual_cashflow_target" {...register("stra_annual_cashflow_target", { required: true, })} />
                                        </div>
                                        {errors.stra_annual_cashflow_target && errors.stra_annual_cashflow_target.type === "required" && (
                                            <small className="text-danger">Annual Cashflow is required.</small>
                                        )}
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>How soon do you want to achieve your Cashflow target ?</label>
                                            <input type='number' name="stra_cashflow_target_achieve" {...register("stra_cashflow_target_achieve", { required: true, })} />
                                        </div>
                                        {errors.stra_cashflow_target_achieve && errors.stra_cashflow_target_achieve.type === "required" && (
                                            <small className="text-danger">Cashflow target achieve year is required.</small>
                                        )}
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>What is your risk appetite ?</label>
                                            <select name="stra_risk_app" className="custom-select" {...register("stra_risk_app")}>
                                                <option value="">Select Risk Appetite</option>
                                                <option value="low">low</option>
                                                <option value="medium">medium</option>
                                                <option value="high">high</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="tf-btn primary mt-2" disabled={showloader}>
                                {showloader ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Strategies