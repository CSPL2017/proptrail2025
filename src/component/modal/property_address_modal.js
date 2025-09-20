import React, { useState, useEffect, useRef, useContext } from "react";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApiService } from "../services/apiservices";
import DataContext from "../elements/context";
let apiServices = new ApiService();
function PropertyAddress({ handleClose }) {

  const contextValues = useContext(DataContext)
  const [showloader, setshowloader] = useState(false)
  const [activeLoanAmount, setactiveLoanAmount] = useState(false)
  const [activeBankValuation, setactiveBankValuation] = useState(false)
  const [activePurchaseDeposit, setactivePurchaseDeposit] = useState(false)
  const [step, setStep] = useState(1)
  const [purchaseStatus, setPurcahseStatus] = useState('no')
  const [defaultValues, setdefaultValues] = useState({})
  const address = contextValues.address
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    formState: { errors }
  } = useForm();
  const Navigate = useNavigate()
  const rawAddress = address;
  const addressArray = rawAddress ? rawAddress.split(',') : [];
  const secondToLastPart = addressArray.length >= 2 ? addressArray[addressArray.length - 2].trim() : null;

  const parts = secondToLastPart ? secondToLastPart.split(' ') : [];
  if (parts.length > 1) {
    parts.pop();
  }
  const lastWord = secondToLastPart ? secondToLastPart.split(' ').pop() : null;
  const didMountRef = useRef(true)
  useEffect(() => {
    if (didMountRef.current) {
      apiServices.getdefaultvaluesrequest().then(res => {
        if (res?.data?.status == "success") {
          setdefaultValues(res?.data?.defaultvalues)
        }
      })
    }
    didMountRef.current = false;
    if (address && addressArray) {
      setValue('address', rawAddress)
      setValue('suburb', parts.toString())
      setValue('state', lastWord)
      setValue('advanceddetails', false)
      setValue('purchaseconfiguration', defaultValues?.dfpurchase_config)
      setValue('purchaseprice', '')
      setValue('variable', '')
      setValue('fixed', '')
      setValue('property_purchase_deposit', '');
      setValue("property_bank_valuation", '')
      setValue("property_loan_amount", '')
      // setValue("property_deposit", '')
      setStep(1)
    }
    // rentalpwfunction()
  }, [address])

  const onSubmit = (data) => {
    if (fixedvariable && fixedvariable.fixed && fixedvariable.variable) {
      if (Number(fixedvariable.fixed) + Number(fixedvariable.variable) < 100 || Number(fixedvariable.fixed) + Number(fixedvariable.variable) > 100) {
        setError("fixed", {
          type: "manual",
          message: "Total percentage of variable and fixed should be of 100",
        })
        setError("variable", {
          type: "manual",
          message: "Total percentage of variable and fixed should be of 100",
        })
        return
      }
    }

    setshowloader(true)
    const dataString = {
      property_adress: data.address,
      property_suburb: data.suburb,
      property_state: data.state,
      property_lga: data.propertylga,
      property_landsize: data.propertylandsize,
      property_purchase_price: data.purchaseprice,
      property_purchase_deposit: data.property_purchase_deposit,
      property_type: data.purchasetype,
      property_purchase_configration: data.purchaseconfiguration,
      property_bank_valuation: data.property_bank_valuation,
      purchaseStatus: purchaseStatus,
      // property_deposit:data.property_deposit,
      property_loan_amount: data.property_loan_amount
    }
    apiServices.saveaddressPostRequest(dataString).then(res => {
      if (res.data.status == "success") {
        toast.success(res?.data?.message)
        setshowloader(false)
        if (res.data.data.purchaseStatus == 'yes') {
          Navigate('/property-purchase/' + res.data.id)
        }
        else {
          Navigate('/purchase-details/' + res.data.id)
        }

      } else if (res?.data?.status == "error" && (res.data.message == 'session_expired' || res.data.message === 'User not found')) {
        toast.error(res?.data?.message)
        localStorage.removeItem("USER_TOKEN")
        setshowloader(false)
        Navigate('/')
      }
      else {
        setTimeout(() => {
          toast.error(res?.data?.message)
          setshowloader(false)
        })
      }

    }).catch(() => { })
  };

  const fixedvariable = {
    fixed: watch("fixed"),
    variable: watch("variable"),
    purchaseprice: watch("purchaseprice")
  }
  const rentalpwfunction = () => {
    setValue('property_purchase_deposit', (getValues('purchaseprice') * 20) / 100);
    setValue("property_bank_valuation", getValues("purchaseprice"))
    setValue("property_loan_amount", getValues("purchaseprice") * 0.8)
    // setValue("property_deposit", getValues("purchaseprice") * 0.2)
    setactiveLoanAmount(true)
    setactiveBankValuation(true)
    setactivePurchaseDeposit(true)
  }
  const advanceddetailcheckbox = watch("advanceddetails")

  return (
    <>
      <div className="modal fade" id="propertyModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="propertyModalContent">
              <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
              <h5>How would you like to track? </h5>
              <p>Knowing why you're tracking this property helps us show you information relevant to you.</p>
              {step === 1 ?
                <div>
                  <h6>Have you already purchased the property?</h6>
                  <select name="purcahse_property"
                    className="custom-select"
                    onChange={(e) => { setPurcahseStatus(e.target.value) }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no" selected>No</option>
                  </select>
                  <button className="btn btn-primary mt-3" onClick={() => { setStep(2) }}>Next</button>
                </div> :

                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-3">
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>Address </label>
                          <input
                            type="text"

                            // defaultValue={addressArray}
                            name="address"
                            {...register("address", {
                              required: true,
                            })}
                          />
                          {errors.address && errors.address.type === "required" && (
                            <small className="text-danger">Address is required.</small>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="justify-content-start">What is the purchase price<span className="text-center">*</span></label>
                          <input
                            type="number"

                            name="purchaseprice"
                            onKeyUp={rentalpwfunction}
                            {...register("purchaseprice", {
                              required: true,
                            })}
                          />
                          {errors.purchaseprice && errors.purchaseprice.type === "required" && (
                            <small className="text-danger">Purchase price is required.</small>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>what is the amount that you are depositing for the purchase</label>
                          <input
                            type='number'
                            step="any"
                            className={activePurchaseDeposit ? 'text-secondary' : 'text-dark'}
                            onKeyUp={() => { setactivePurchaseDeposit(false) }}
                            name="property_purchase_deposit"
                            {...register("property_purchase_deposit", {

                            })}
                          />


                        </div>
                        {errors.property_purchase_deposit && errors.property_purchase_deposit.type === "required" && (
                          <small className="text-danger">Purchase deposit is required.</small>
                        )}
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>Property Type</label>

                          <select name="purchasetype" className="custom-select"
                            {...register("purchasetype", {
                              required: true,
                            })}
                          >
                            <option >select the property type</option>
                            <option value="new">New</option>
                            <option selected value="established">Established</option>
                          </select>
                          {errors.purchasetype && errors.purchasetype.type === "required" && (
                            <small className="text-danger">Property Type is required.</small>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="d-flex mb-20">
                          <input
                            type='checkbox'
                            name="advanceddetails"
                            {...register("advanceddetails", {
                            })}
                          />
                          <span className="ml-10">Default Values (Change as needed) </span></div>

                      </div>
                      {advanceddetailcheckbox && <>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label>Suburb </label>
                            <input
                              type="text"
                              name="suburb"
                              // defaultValue={parts}
                              {...register("suburb", {
                                required: true,
                              })}
                            />
                            {errors.suburb && errors.suburb.type === "required" && (
                              <small className="text-danger">Suburb is required.</small>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label>State </label>
                            <select type="text"
                              className="custom-select"
                              name="state"
                              // defaultValue={lastWord}
                              {...register("state", {
                                required: true,
                              })}>
                              <option value="">Select State</option>
                              <option value="WA">Western Australia</option>
                              <option value="SA">South Australia</option>
                              <option value="VIC">Victoria</option>
                              <option value="NSW">New South Wales </option>
                              <option value="ACT">Australian Capital Territory</option>
                              <option value="NT">Northern Territory</option>
                              <option value="TAS">Tasmania</option>
                              <option value="QLD">Queensland</option>
                            </select>
                            {errors.state && errors.state.type === "required" && (
                              <small className="text-danger">State is required.</small>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="form-group">
                            <label>Purchase Configuration </label>
                            <select
                              type="number"
                              className="custom-select"
                              // defaultValue={defaultValues?.dfpurchase_config}
                              name="purchaseconfiguration"
                              {...register("purchaseconfiguration", {
                                required: true,

                              })}
                            >
                              <option value=""> Select Purchase Configuration</option>
                              <option value="5*3">5*3</option>
                              <option value="5*2">5*2</option>
                              <option value="4*3">4*3</option>
                              <option value="4*2">4*2</option>
                              <option value="4*1">4*1</option>
                              <option value="3*2">3*2</option>
                              <option value="3*1">3*1</option>
                              <option value="2*1">2*1</option>
                              <option value="1*1">1*1</option>
                              <option value="custom">Custom</option>

                            </select>
                            {errors.purchaseconfiguration && errors.purchaseconfiguration.type === "required" && (
                              <small className="text-danger">Purchase Configuration is required.</small>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="form-group">
                            <label>Bank Valuation</label>
                            <input
                              type="number"
                              step="any"
                              className={activeBankValuation ? 'text-secondary' : 'text-dark'}
                              onKeyUp={() => { setactiveBankValuation(false) }}
                              name="property_bank_valuation"
                              {...register("property_bank_valuation", {
                                required: true,

                              })}
                            />
                            {errors.property_bank_valuation && errors.property_bank_valuation.type === "required" && (
                              <small className="text-danger">Bank Valuation is required.</small>
                            )}
                          </div>
                        </div>
                        {/* <div className="col-lg-12">
                      <div className="form-group">
                        <label>LGA</label>
                        <input
                          type="text"

                          name="propertylga"
                          {...register("propertylga")}
                        />
                      </div>
                    </div> */}
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label>Landsize  (m²)</label>
                            <input
                              type="text"
                              className="form-control"
                              name="propertylandsize"
                              {...register("propertylandsize", {
                                // required: true,
                              })}
                            />
                            {errors.propertylandsize && errors.propertylandsize.type === "required" && (
                              <small className="text-danger">Landsize is required.</small>
                            )}
                          </div>

                        </div>
                        <div className="col-lg-12 ">
                          <div className="form-group">
                            <label>Loan Amount</label>
                            <input
                              type="number"
                              name="property_loan_amount"
                              step="any"
                              className={activeLoanAmount ? 'text-secondary' : 'text-dark'}
                              onKeyUp={() => { setactiveLoanAmount(false) }}
                              {...register("property_loan_amount", {
                                required: true,

                              })}
                            />
                            {errors.property_loan_amount && errors.property_loan_amount.type === "required" && (
                              <small className="text-danger">Loan Amount is required.</small>
                            )}
                          </div>

                        </div>

                      </>}
                    </div>
                    <div className="row g-3 " >
                      <div className="col-lg-12">
                        <button type="submit" className="btn btn-full btn-lg btn-primary" disabled={showloader} >
                          {showloader ? (
                            <img src="/img/loder01.gif" width="60px" height="11px" />
                          ) : (
                            "Submit"
                          )}</button>
                      </div>

                    </div>
                  </form>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyAddress;