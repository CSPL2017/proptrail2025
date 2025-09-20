import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../component/utils/loader";
import Summary from "../../component/summary_annalysis";
import DataContext from "../../component/elements/context";
import { ApiService } from "../../component/services/apiservices";
import Header from "../../component/header";
import Footer from "../../component/footer";

function MaintainnceTable() {
  const location = useLocation()
  const [maintainncetableData, setmaintainncetableData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [showtable, setshowtable] = useState("summary")
  const [showactionbtns, setshowactionbtns] = useState(false);
  const [showinputs, setshowinputs] = useState({})
  const [selectedObject, setselectObject] = useState({})
  const [purchasedata, setpurchasedata] = useState({})
  const [propertyData, setpropertyData] = useState({})
  const [showloader, setshowloader] = useState(false)
  const [selectedValues, setSelectedValues] = useState(Array(maintainncetableData?.length).fill("0"));
  const { id } = useParams();
  const didMountRef = useRef(true);
  const contextValues = useContext(DataContext)
  const navigate = useNavigate()
  const tableRef = useRef(null);
  const handleClose = () => {
    const modalEl = document.getElementById("actualReadingsModal");
    if (modalEl && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  const handleShow = () => {
    const modalEl = document.getElementById("actualReadingsModal");
    if (modalEl && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  };

  useEffect(() => {
    if (didMountRef.current) {
      fetchData();

    }
    didMountRef.current = false;
  }, []);

  const fetchData = async () => {
    setshowloader(true)
    try {
      const dataString = {
        id: id
      }
      ApiService.postData('property/getsavedmaintainancetabledata', dataString).then((res) => {
        if (res?.status == "success") {
          setmaintainncetableData(res.maintainaancedata?.maintainance_table_data);
          setpurchasedata(res.purchasedata)
          setpropertyData(res.propertydata)
          setshowloader(false)
        } else if (res.status == "error" && res.message == 'session_expired') {
          toast.error(res.message)
          localStorage.removeItem("USER_TOKEN")
          setshowloader(false)
          navigate('/')
        } else {
          toast.error(res.message)
          setshowloader(false)
        }
      }).catch((error) => { setshowloader(false) })
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeInput = (e, index) => {
    const { name, value } = e.target;
    setshowinputs((prevInputs) => {
      const updatedInputs = { ...prevInputs };

      updatedInputs[index] = {
        ...updatedInputs[index],
        [name]: value,
      };
      updatedInputs[index] = {
        ...updatedInputs[index],
        estimate_heading: selectedValues[index],
      };
      return updatedInputs;
    });

  };

  const submitMainatianancedata = (index) => {
    const dataString = {
      id: id
    };
    ApiService.postData('property/getsavedmaintainancetabledata', dataString).then((res) => {
      if (res.status === "success") {
        const data = res.maintainaancedata?.maintainance_table_data;
        const originalArray = [...data];
        const updatedMaintainanceData = [...maintainncetableData];
        const updatedItem = updatedMaintainanceData[index];
        const objectsDiffer = Object.keys(originalArray[index]).some((key) => {
          return originalArray[index][key] !== updatedItem[key];
        });
        if (objectsDiffer) {
          originalArray[index] = { ...updatedItem };
          const dataString = {
            maintainance_table_data: originalArray,
            property_id: id,
            type: 0
          };
          ApiService.postData('property/savenewmaintainanacetabledata', dataString).then((res) => {
            if (res.status == "success") {
              toast.success(res.data.message)
            }
            else if (res.status == "error" && res.message == 'session_expired') {
              toast.error(res.message)
              localStorage.removeItem("USER_TOKEN")
              setshowloader(false)
              navigate('/')
            } else if (res.status === "error") {
              toast.error(res.message);
              setshowloader(false);
            }
          });

          setshowinputs((prevInputs) => ({
            ...prevInputs,
            [index]: {
              inflation: "",
              rental_growth: "",
              growth_assump: "",
              owner_occupied_week: "",
              letting_fee_weeks: "",
              vacant_week: "",
              building_insuar: "",
              land_tax: "",
              property_manag_perc: "",
            },
          }));
          setshowactionbtns((prevShowActionBtns) => ({
            ...prevShowActionBtns,
            [index]: false,
          }));
          return;
        }
      } else if (res.status == "error" && res.message == 'session_expired') {
        toast.error(res.message)
        localStorage.removeItem("USER_TOKEN")
        setshowloader(false)
        navigate('/')
      } else {
        toast.error(res.message);
        setshowloader(false);
      }
    }).catch(() => { });
  };

  const handleEditClick = (index) => {
    const selectedObject = maintainncetableData[index];
    setselectObject(selectedObject);
    setSelectedRowIndex(index);
    handleShow();
  };

  const handleInputEditSubmit = (index) => {
    const updatedMaintainanceData = [...maintainncetableData];
    const selectedItem = updatedMaintainanceData[index];
    const rowInputs = showinputs[index] || {};
    const valuesChanged = Object.keys(rowInputs).some((key) => {
      return rowInputs[key] !== selectedObject[key];
    });
    selectedItem.estimate_heading = valuesChanged ? "1" : selectedObject.estimate_heading;
    selectedItem.weekly_rental_income = parseFloat(rowInputs.weekly_rental_income) ? parseFloat(rowInputs.weekly_rental_income) : parseFloat(rowInputs.weekly_rental_income) == 0 ? 0 : selectedItem.weekly_rental_income;
    selectedItem.vacant_week = parseFloat(rowInputs.vacant_week) ? parseFloat(rowInputs.vacant_week) : parseFloat(rowInputs.vacant_week) == 0 ? 0 : selectedItem.vacant_week;
    selectedItem.letting_fee_weeks = parseFloat(rowInputs.letting_fee_weeks) ? parseFloat(rowInputs.letting_fee_weeks) : parseFloat(rowInputs.letting_fee_weeks) == 0 ? 0 : selectedItem.letting_fee_weeks;
    selectedItem.owner_occupied_week = parseFloat(rowInputs.owner_occupied_week) ? parseFloat(rowInputs.owner_occupied_week) : parseFloat(rowInputs.owner_occupied_week) == 0 ? 0 : selectedItem.owner_occupied_week;
    selectedItem.inflation = parseFloat(rowInputs.inflation) ? parseFloat(rowInputs.inflation) : parseFloat(rowInputs.inflation) == 0 ? 0 : selectedItem.inflation;
    selectedItem.growth_assump = parseFloat(rowInputs.growth_assump) ? parseFloat(rowInputs.growth_assump) : parseFloat(rowInputs.growth_assump) == 0 ? 0 : selectedItem.growth_assump;
    selectedItem.rental_growth = parseFloat(rowInputs.rental_growth) ? parseFloat(rowInputs.rental_growth) : parseFloat(rowInputs.rental_growth) == 0 ? 0 : selectedItem.rental_growth;
    selectedItem.property_manag_perc = parseFloat(rowInputs.property_manag_perc) ? parseFloat(rowInputs.property_manag_perc) : parseFloat(rowInputs.property_manag_perc) == 0 ? 0 : selectedItem.property_manag_perc;
    selectedItem.land_tax = parseFloat(rowInputs.land_tax) ? parseFloat(rowInputs.land_tax) : parseFloat(rowInputs.land_tax) == 0 ? 0 : selectedItem.land_tax;
    selectedItem.building_insuar = parseFloat(rowInputs.building_insuar) ? parseFloat(rowInputs.building_insuar) : parseFloat(rowInputs.building_insuar) == 0 ? 0 : selectedItem.building_insuar;
    const updatedselecteditem = performAdditionalCalculations(selectedItem, index, rowInputs, maintainncetableData);
    // Update the selectedItem with the updated values
    for (const key in updatedselecteditem) {
      selectedItem[key] = updatedselecteditem[key];
    }
    setmaintainncetableData(updatedMaintainanceData);
    setshowinputs((prevInputs) => ({
      ...prevInputs,
      [index]: {
        inflation: "",
        rental_growth: "",
        growth_assump: "",
        owner_occupied_week: "",
        letting_fee_weeks: "",
        vacant_week: "",
        building_insuar: "",
        land_tax: "",
        property_manag_perc: "",
      },
    }));
    setshowactionbtns((prevShowActionBtns) => ({
      ...prevShowActionBtns,
      [index]: true,
    }));
    handleClose()
  };

  const performAdditionalCalculations = (selectedItem, index, rowInputs, maintainncetableData) => {

    // additional calculation start
    let weekly_rental_income = 0
    let Council_rates = 0
    let water_rates = 0
    let building_insuar = 0
    let maintaince_allownce = 0
    let property_value = 0
    let principal_payment_fixed = 0
    let principal_payment_variable = 0
    let principal_pay = 0
    let total_loan_amount = 0
    let loanamount_variable = 0
    let loanamount_fixed = 0
    let totalLoan_interest_fixed = 0
    let totalLoan_interest_variable = 0
    let principal_payment_variable_cummulative = 0
    let previous_net_annualcashflow = 0
    let previous_property_value = 0
    let previousprincipal_vari = 0
    let previousprincipal_fix = 0
    let principal_payment_fixed_cummulative = 0
    let previous_capital_commuta_growth_value = 0
    let previous_net_annualcashflowcumu = 0
    const currentYear = selectedItem?.currentYear;
    const estimate_heading = selectedItem?.estimate_heading
    const growth_assump = selectedItem?.growth_assump
    const rental_growth = selectedItem?.rental_growth
    const inflation = selectedItem?.inflation
    const Loan_interest_fixed = selectedItem?.Loan_interest_fixed
    const Loan_interest_variable = selectedItem?.Loan_interest_variable
    const termLength = 30
    const rf = Loan_interest_fixed / 100
    const rv = Loan_interest_variable / 100
    const purchase_fixedperc = parseFloat(purchasedata?.purchase_interest_fixed) / 100
    const purchase_variableperc = parseFloat(purchasedata?.purchase_interest_variable) / 100
    const totalrequiredcash = parseFloat(purchasedata?.purchase_total_cash_req)
    if (rowInputs.hasOwnProperty('weekly_rental_income') && typeof rowInputs.weekly_rental_income !== 'undefined') {
      weekly_rental_income = parseFloat(rowInputs.weekly_rental_income) || 0;
    } else if (index > 0) {
      const previousIndex = index - 1 >= 0 ? index - 1 : maintainncetableData.length - 1;
      const previousWeeklyRentalIncome = parseFloat(maintainncetableData[previousIndex]?.weekly_rental_income) || 0;
      weekly_rental_income = previousWeeklyRentalIncome + (previousWeeklyRentalIncome * (selectedItem?.rental_growth / 100));
    }
    else {
      weekly_rental_income = parseFloat(selectedItem?.weekly_rental_income)
    }
    if (rowInputs.hasOwnProperty('building_insuar') && typeof rowInputs.building_insuar !== 'undefined') {
      building_insuar = parseFloat(rowInputs.building_insuar) || 0;
    } else if (index > 0) {
      const previousIndex = index - 1 >= 0 ? index - 1 : maintainncetableData.length - 1;
      const previousbuildins = parseFloat(maintainncetableData[previousIndex]?.building_insuar) || 0;
      building_insuar = previousbuildins + (previousbuildins * (selectedItem?.inflation / 100));
    }
    else {
      building_insuar = parseFloat(selectedItem?.building_insuar)
    }
    if (index > 0) {
      const previousIndex = index - 1 >= 0 ? index - 1 : maintainncetableData.length - 1;
      const previouspropvalue = parseFloat(maintainncetableData[previousIndex]?.property_value) || 0;
      const previouswater_rate = parseFloat(maintainncetableData[previousIndex]?.water_rates) || 0;
      const previouscouncilrate = parseFloat(maintainncetableData[previousIndex]?.Council_rates) || 0;
      const previousmaintainallow = parseFloat(maintainncetableData[previousIndex]?.maintaince_allownce) || 0;
      const previousloanamount_fixed = parseFloat(maintainncetableData[previousIndex]?.loanamount_fixed) || 0;
      const previousloanamount_varia = parseFloat(maintainncetableData[previousIndex]?.loanamount_variable) || 0;
      const previoustotalloanamount = parseFloat(maintainncetableData[previousIndex]?.total_loan_amount) || 0;
      previousprincipal_vari = parseFloat(maintainncetableData[previousIndex]?.principal_payment_variable) || 0;
      previousprincipal_fix = parseFloat(maintainncetableData[previousIndex]?.principal_payment_fixed) || 0;
      const previousprincipal_pay = parseFloat(maintainncetableData[previousIndex]?.principal_pay) || 0;
      previous_net_annualcashflowcumu = parseFloat(maintainncetableData[previousIndex]?.net_annual_cashflow_cummulative)
      previous_capital_commuta_growth_value = parseFloat(maintainncetableData[previousIndex]?.capital_growth_annual_cummulative)
      previous_net_annualcashflow = parseFloat(maintainncetableData[previousIndex]?.net_annual_cash_flow)
      property_value = previouspropvalue + (previouspropvalue * (selectedItem?.growth_assump / 100));
      water_rates = previouswater_rate + (previouswater_rate * (selectedItem.inflation / 100));
      Council_rates = previouscouncilrate + (previouscouncilrate * (selectedItem.inflation / 100));
      maintaince_allownce = previousmaintainallow + (previousmaintainallow * (selectedItem.inflation / 100));
      loanamount_variable = previousloanamount_varia - previousprincipal_vari
      loanamount_fixed = previousloanamount_fixed - previousprincipal_fix
      total_loan_amount = previoustotalloanamount - previousprincipal_pay
    }
    else {
      water_rates = selectedItem?.water_rates
      Council_rates = selectedItem?.Council_rates
      maintaince_allownce = selectedItem?.maintaince_allownce
      property_value = selectedItem?.property_value
      total_loan_amount = selectedItem?.total_loan_amount
      loanamount_fixed = parseFloat(total_loan_amount * purchase_fixedperc)
      loanamount_variable = parseFloat(total_loan_amount * purchase_variableperc)
      previous_net_annualcashflowcumu = 0
      previousprincipal_vari = 0
      previousprincipal_fix = 0
      previous_capital_commuta_growth_value = 0
      previous_net_annualcashflow = 0

    }

    totalLoan_interest_variable = total_loan_amount * purchase_variableperc * rv
    totalLoan_interest_fixed = total_loan_amount * purchase_fixedperc * rf
    let fixedmonthlypayment = () => {
      const totalfixedLoanAmount = parseFloat(loanamount_fixed);
      const interestRate = parseFloat(Loan_interest_fixed) / 1200;
      const numberOfMonths = parseFloat(termLength) * 12;

      if (
        !isNaN(totalfixedLoanAmount) &&
        !isNaN(interestRate) &&
        !isNaN(numberOfMonths)
      ) {
        const result = ((totalfixedLoanAmount *
          interestRate *
          Math.pow(1 + interestRate, numberOfMonths)) /
          (Math.pow(1 + interestRate, numberOfMonths) - 1)).toFixed(2)
        return result;
      } else {
        // Handle invalid inputs or show an error message
        return "Invalid input. Please check your values.";
      }
    };

    let variablemonthlypayment = () => {
      const totalvariableLoanAmount = parseFloat(loanamount_variable);
      const interestRate = parseFloat(Loan_interest_variable) / 1200;
      const numberOfMonths = parseFloat(termLength) * 12;

      if (
        !isNaN(totalvariableLoanAmount) &&
        !isNaN(interestRate) &&
        !isNaN(numberOfMonths)
      ) {
        const result = ((totalvariableLoanAmount *
          interestRate *
          Math.pow(1 + interestRate, numberOfMonths)) /
          (Math.pow(1 + interestRate, numberOfMonths) - 1)).toFixed(2)
        return result;
      } else {
        // Handle invalid inputs or show an error message
        return "Invalid input. Please check your values.";
      }
    };
    principal_payment_fixed = ((fixedmonthlypayment() * 12) - (totalLoan_interest_fixed))
    principal_payment_variable = ((variablemonthlypayment() * 12) - (totalLoan_interest_variable))
    principal_pay = parseFloat(principal_payment_variable) + parseFloat(principal_payment_fixed)
    const purchase_loan_amount = parseFloat(selectedItem?.purchase_loan_amount)
    const total_loan_interest = totalLoan_interest_fixed + totalLoan_interest_variable
    const purchase_building_insua_cost = parseFloat(selectedItem?.purchase_building_insua_cost)
    const purchase_water_rates = parseFloat(selectedItem?.purchase_water_rates)
    const purchase_council_rates = parseFloat(selectedItem?.purchase_council_rates)
    const property_purchase_price = parseFloat(selectedItem?.property_purchase_price)
    const purchase_allownce_main = parseFloat(selectedItem?.purchase_allownce_main)
    const gross_annual_rental = weekly_rental_income * 52
    const owner_occupied_week = selectedItem?.owner_occupied_week
    const owner_rental_saved = weekly_rental_income * owner_occupied_week
    const vacant_week = selectedItem?.vacant_week
    const vacant_rate = vacant_week / 52
    const rental_loss = weekly_rental_income * vacant_week
    const letting_fee_weeks = selectedItem?.letting_fee_weeks
    const actual_rental_inc = (gross_annual_rental * (1 - vacant_rate)) - (letting_fee_weeks) + (owner_rental_saved)
    const letting_fee = weekly_rental_income * letting_fee_weeks
    const property_manag_perc = selectedItem?.property_manag_perc
    const total_property_manage_fee = gross_annual_rental * (property_manag_perc / 100)
    const interest_fixed = selectedItem?.interest_fixed
    const interest_variable = selectedItem?.interest_variable
    const adjusted_income = gross_annual_rental + owner_rental_saved - (rental_loss + letting_fee)
    const gross_annual_property_income = adjusted_income
    const forcast_annual_cash_exp = parseFloat(total_property_manage_fee) + parseFloat(building_insuar) + parseFloat(water_rates) + parseFloat(Council_rates) + parseFloat(maintaince_allownce) + parseFloat(total_loan_interest)
    const land_tax = selectedItem?.land_tax
    const forcast_annual_non_deductexpe = parseFloat(land_tax) + parseFloat(principal_pay)
    const potential_deduction = parseFloat(forcast_annual_cash_exp) + parseFloat(interest_fixed) + parseFloat(interest_variable)
    const forcast_annual_deduc = selectedItem?.forcast_annual_deduc
    const potential_annual_net_cash_flow = parseFloat(forcast_annual_non_deductexpe) + parseFloat(potential_deduction)
    const equity = parseFloat(property_value) - parseFloat(total_loan_amount)
    // new added fields
    const interest_expense_fixed = parseFloat(totalLoan_interest_fixed)
    const interest_expense_variable = parseFloat(totalLoan_interest_variable)
    const total_interest_expence = parseFloat(interest_expense_fixed) + parseFloat(interest_expense_variable)
    let total_uplift_cost = 0
    const operating_expenses = parseFloat(total_property_manage_fee) + parseFloat(building_insuar) + parseFloat(water_rates) + parseFloat(Council_rates) + parseFloat(maintaince_allownce)
    const cashoutflow = parseFloat(total_interest_expence) + parseFloat(operating_expenses) + parseFloat(total_uplift_cost)
    const gross_income = parseFloat(adjusted_income)
    const total_principal_payment = parseFloat(principal_payment_fixed) + parseFloat(principal_payment_variable)
    const net_annual_cash_flow = parseFloat(gross_income) - parseFloat(cashoutflow) - parseFloat(total_principal_payment)

    const net_annual_cashflow_cummulative = parseFloat(net_annual_cash_flow) + parseFloat(previous_net_annualcashflowcumu)
    principal_payment_fixed_cummulative = parseFloat(principal_payment_fixed) + parseFloat(previousprincipal_fix)
    principal_payment_variable_cummulative = parseFloat(principal_payment_variable) + parseFloat(previousprincipal_vari)

    const totalprincipalpaymentcummulative = parseFloat(principal_payment_fixed_cummulative) + parseFloat(principal_payment_variable_cummulative)
    const grossyield = (parseFloat(gross_annual_rental) / parseFloat(property_purchase_price)) * 100
    const netyeild = (parseFloat(net_annual_cash_flow) / parseFloat(property_purchase_price)) * 100
    const income_per_month = parseFloat(net_annual_cash_flow) / 12
    const income_per_week = parseFloat(net_annual_cash_flow) / 52
    const capital_growth_annual = parseFloat(property_value) - parseFloat(previous_property_value)
    const capital_growth_annual_cummulative = parseFloat(capital_growth_annual) + parseFloat(previous_capital_commuta_growth_value)
    const total_performance = parseFloat(capital_growth_annual_cummulative) + parseFloat(net_annual_cashflow_cummulative)
    const total_performance_principal = parseFloat(capital_growth_annual_cummulative) + parseFloat(net_annual_cash_flow) + parseFloat(totalprincipalpaymentcummulative)
    const cash_on_cash_return = ((parseFloat(net_annual_cash_flow) + parseFloat(previous_net_annualcashflow)) / parseFloat(totalrequiredcash)) * 100
    const return_interest_capital = ((parseFloat(equity) + parseFloat(net_annual_cash_flow)) / parseFloat(totalrequiredcash)) * 100
    const updatedselecteditem = {
      estimate_heading: estimate_heading,
      currentYear: currentYear,
      growth_assump: growth_assump,
      rental_growth: rental_growth,
      inflation: inflation,
      weekly_rental_income: weekly_rental_income,
      purchase_building_insua_cost: purchase_building_insua_cost,
      purchase_water_rates: purchase_water_rates,
      purchase_council_rates: purchase_council_rates,
      purchase_loan_amount: purchase_loan_amount,
      property_purchase_price: property_purchase_price,
      purchase_allownce_main: purchase_allownce_main,
      gross_annual_rental: gross_annual_rental,
      owner_occupied_week: owner_occupied_week,
      owner_rental_saved: owner_rental_saved,
      vacant_week: vacant_week,
      vacant_rate: vacant_rate,
      rental_loss: rental_loss,
      adjusted_income: adjusted_income,
      totalLoan_interest_fixed: totalLoan_interest_fixed,
      totalLoan_interest_variable: totalLoan_interest_variable,
      total_loan_interest: total_loan_interest,
      gross_annual_property_income: gross_annual_property_income,
      letting_fee_weeks: letting_fee_weeks,
      letting_fee: letting_fee,
      actual_rental_inc: actual_rental_inc,
      property_manag_perc: property_manag_perc,
      total_property_manage_fee: total_property_manage_fee,
      interest_fixed: interest_fixed,
      interest_variable: interest_variable,
      building_insuar: building_insuar,
      Loan_interest_fixed: Loan_interest_fixed,
      Loan_interest_variable: Loan_interest_variable,
      water_rates: water_rates,
      Council_rates: Council_rates,
      maintaince_allownce: maintaince_allownce,
      forcast_annual_cash_exp: forcast_annual_cash_exp,
      land_tax: land_tax,
      principal_pay: principal_pay,
      forcast_annual_non_deductexpe: forcast_annual_non_deductexpe,
      forcast_annual_deduc: forcast_annual_deduc,
      potential_annual_net_cash_flow: potential_annual_net_cash_flow,
      property_value: property_value,
      principal_payment_fixed: principal_payment_fixed,
      total_loan_amount: total_loan_amount,
      equity: equity,
      maintainance_property_id: id,
      // new added fields
      cashoutflow: cashoutflow,
      total_interest_expence: total_interest_expence,
      interest_expense_variable: interest_expense_variable,
      interest_expense_fixed: interest_expense_fixed,
      principal_payment_variable_cummulative: principal_payment_variable_cummulative,
      principal_payment_fixed_cummulative: principal_payment_fixed_cummulative,
      principal_payment_variable: principal_payment_variable,
      capital_growth_annual_cummulative: capital_growth_annual_cummulative,
      capital_growth_annual: capital_growth_annual,
      net_annual_cashflow_cummulative: net_annual_cashflow_cummulative,
      net_annual_cash_flow: net_annual_cash_flow,
      total_uplift_cost: total_uplift_cost,
      total_performance_principal: total_performance_principal,
      total_performance: total_performance,
      income_per_week: income_per_week,
      income_per_month: income_per_month,
      netyeild: netyeild,
      grossyield: grossyield,
      totalprincipalpaymentcummulative: totalprincipalpaymentcummulative,
      total_principal_payment: total_principal_payment,
      loanamount_variable: loanamount_variable,
      loanamount_fixed: loanamount_fixed,
      gross_income: gross_income,
      operating_expenses: operating_expenses,
      cash_on_cash_return: cash_on_cash_return,
      return_interest_capital: return_interest_capital
    }
    return updatedselecteditem;
  };

  const handleResetChanges = (index) => {
    const dataString = {
      id: id
    };
    ApiService.postData('property/getsavedmaintainancetabledata', dataString).then((res) => {
      if (res.status === "success") {
        const data = res.maintainaancedata?.maintainance_table_data;
        const updatedMaintainanceData = [...maintainncetableData];
        const selectedItem = updatedMaintainanceData[index];
        updatedMaintainanceData[index] = { ...data[index] };
        setmaintainncetableData(updatedMaintainanceData);
        setshowinputs((prevInputs) => ({
          ...prevInputs,
          [index]: {
            inflation: "",
            rental_growth: "",
            growth_assump: "",
            owner_occupied_week: "",
            letting_fee_weeks: "",
            vacant_week: "",
            building_insuar: "",
            land_tax: "",
            property_manag_perc: "",
          },
        }));
        setshowactionbtns((prevShowActionBtns) => ({
          ...prevShowActionBtns,
          [index]: false,
        }));

        return;
      } else if (res.status == "error" && res.message == 'session_expired') {
        toast.error(res.message)
        localStorage.removeItem("USER_TOKEN")
        setshowloader(false)
        navigate('/')
      } else {
        toast.error(res.message);
        setshowloader(false);
      }
    }).catch(() => { });
  };

  const changeTrackpropertyStatus = (status, type) => {
    let dataString = {
      property_id: id,
      property_track_status: status
      // property_status:status
    }
    ApiService.postData('property/checkpropertytrackstatus', dataString).then((res) => {
      if (res.status == 'success') {
        contextValues.setToggletrackModal(false)
        if (type == 'track') {
          navigate('/track-my-property')
        } else if (type == 'myproperty') {
          navigate('/dashboard')
        }
      } else if (res?.status == "error" && res.message == 'session_expired') {
        toast.error(res?.message)
        localStorage.removeItem("USER_TOKEN")
        setshowloader(false)
        navigate('/')
      } else {
        toast.error(res?.message);
        setshowloader(false);
      }
    }).catch(() => { })
  }
  return (
    <>
      {showloader && <Loader></Loader>}
      <Header />
      <div className="layout-wrap">
        <div className="main-content-inner">
          <div className="widget-box-2">
            <div className="row g-3 justify-content-center mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between mb-4">
                  <h6 >Property Summary</h6>
                  <div>
                    {propertyData?.purchaseStatus == 'no' ? <>
                      {!location.pathname.includes('maintainance-edit') ? (
                        <>
                          <button onClick={() => { changeTrackpropertyStatus(1, 'track') }} type="button" className="tf-btn primary">Track this property </button>
                          <button onClick={() => { changeTrackpropertyStatus(0, 'myproperty') }} type="button" className="tf-btn primary ms-5">Add to my properties</button>
                        </>
                      ) : <button onClick={() => { navigate('/my-property') }} type="button" className="tf-btn primary ms-5"> My Properties </button>}
                    </> : propertyData?.purchaseStatus == 'yes' ? <button onClick={() => { navigate('/dashboard') }} type="button" className="tf-btn primary">Go To Dashboard </button> : ''
                    }
                  </div>
                </div>
                <div style={{ overflowX: 'auto', width: '100%' }} ref={tableRef}>
                  <div className="wrap-table">
                    <div>
                      <ul className="nav nav-tabs nav-fill">
                        <li className="nav-item">
                          <a
                            className={`nav-link ${showtable === "detailedassumption" ? "active" : ""}`}
                            onClick={() => setshowtable("detailedassumption")}
                          >
                            Detailed Assumption(s)
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={`nav-link ${showtable === "incomeoveryear" ? "active" : ""}`}
                            onClick={() => setshowtable("incomeoveryear")}
                          >
                            Income
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={`nav-link ${showtable === "expenses" ? "active" : ""}`}
                            onClick={() => setshowtable("expenses")}
                          >
                            Expenses
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={`nav-link ${showtable === "annalysis" ? "active" : ""}`}
                            onClick={() => setshowtable("annalysis")}
                          >
                            Analysis
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={`nav-link ${showtable === "summary" ? "active" : ""}`}
                            onClick={() => setshowtable("summary")}
                          >
                            Summary
                          </a>
                        </li>
                      </ul>
                    </div>
                    {maintainncetableData?.length > 0 ? <>
                      <div className="table-responsive">
                        {showtable == "detailedassumption" &&
                          <table>
                            <thead className="thead-dark">
                              <tr>
                                <th >year</th>
                                <th >Estimate/Actual</th>
                                <th>Growth Assumption</th>
                                <th>Rental Growth</th>
                                <th>Inflation</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {maintainncetableData?.map((item, index) => {
                                return (<>
                                  <tr key={index}>
                                    <td>{item.currentYear}</td>
                                    <td>{item.estimate_heading == "0" ? "Estimate" : item?.estimate_heading == "1" ? "Actual" : ""}</td>
                                    <td>{item.growth_assump + "%"}</td>
                                    <td>{item.rental_growth + "%"}</td>
                                    <td>{item.inflation + "%"}</td>
                                    <td>
                                      <div className="d-flex justify-content-center gap-2">
                                        <a href="#" className="btn btn-sm btn-outline-primary" onClick={(e) => { e.preventDefault(); handleEditClick(index) }}><i className="ri-pencil-fill"></i></a>
                                        {showactionbtns[index] ? <>
                                          <a href="#" className="btn btn-sm btn-outline-success" onClick={(e) => { e.preventDefault(); submitMainatianancedata(index) }}><i className="ri-checkbox-circle-fill"></i></a>
                                          <a href="#" className="btn btn-sm btn-outline-warning" onClick={(e) => { e.preventDefault(); handleResetChanges(index) }} ><i className="ri-refresh-line"></i></a>
                                        </> : ""}
                                      </div>
                                    </td>
                                  </tr>
                                </>)
                              })}
                            </tbody>
                          </table>}
                        {showtable == "incomeoveryear" &&
                          <table>
                            <thead className="thead-dark">
                              <tr>
                                <th>year</th>
                                <th>Weekly rental income</th>
                                <th>Gross Annual Rental Income</th>
                                <th>Weeks Vacant</th>
                                <th>Vacancy Rate(weeks/52)</th>
                                <th>Rental Loss</th>
                                <th>Letting Fee(weeks)</th>
                                <th>Letting Fee($)</th>
                                <th>Weeks Owner Occupied</th>
                                <th>Owner Occupied Rent Saved</th>
                                <th>Adjusted Income</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {maintainncetableData?.map((items, index) => {
                                return (<>
                                  <tr key={index}>
                                    <td>{items?.currentYear}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{items?.weekly_rental_income?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{items?.gross_annual_rental?.toLocaleString()}</td>
                                    <td>{(items?.vacant_week)?.toFixed(3)}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.vacant_rate)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.rental_loss)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'} {(items?.letting_fee_weeks)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.letting_fee)?.toLocaleString()}</td>
                                    <td>{(items?.owner_occupied_week)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.owner_rental_saved)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.adjusted_income)?.toLocaleString()}</td>
                                    <td>
                                      <div className="d-flex justify-content-center gap-2">
                                        <a href="#" className="btn btn-sm btn-outline-primary" onClick={(e) => { e.preventDefault(); handleEditClick(index) }}><i className="ri-pencil-fill"></i></a>
                                        {showactionbtns[index] ? <>
                                          <a href="#" className="btn btn-sm btn-outline-success" onClick={(e) => { e.preventDefault(); submitMainatianancedata(index) }}><i className="ri-checkbox-circle-fill"></i></a>
                                          <a href="#" className="btn btn-sm btn-outline-warning" onClick={(e) => { e.preventDefault(); handleResetChanges(index) }} ><i className="ri-refresh-line"></i></a>
                                        </> : ""}
                                      </div>
                                    </td>
                                  </tr>
                                </>)
                              })}
                            </tbody>
                          </table>}
                        {showtable == "expenses" &&
                          <table>
                            <thead className="thead-dark">
                              <tr>
                                <th>year</th>
                                <th>Total Loan Amount </th>
                                <th>Fixed Loan Amount </th>
                                <th>Variable Loan Amount </th>
                                <th>Loan Interest Fixed</th>
                                <th>Loan Interest Variable</th>
                                <th>Total Loan Interest Fixed</th>
                                <th>Total Loan Interest Variable</th>
                                <th>Total Loan Interest </th>
                                <th>Principal Payment Fixed</th>
                                <th>Principal Payment Cummulative Fixed</th>
                                <th>Principal Payment Variable</th>
                                <th>Principal Payment Cummulative Variable</th>
                                <th>Total Principal Payment</th>
                                <th>Total Principal Payment Cummulative</th>
                                <th>Property Manangment % </th>
                                <th>Total Property Manangment</th>
                                <th>Building Landloard Insurance</th>
                                <th>Water Rates</th>
                                <th>Council Rates</th>
                                <th>Maintainance</th>
                                <th>Forcast annual cash expense</th>
                                <th>Land Tax (if applicable)</th>
                                <th>Principal Payments Fixed</th>
                                <th>Principal Payments Variable</th>
                                <th>Principal Payments</th>
                                <th>Forcast Annual Non-deductable Expenses</th>
                                <th>Potential annual net cash outflow</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {maintainncetableData?.map((items, index) => {
                                return (<>
                                  <tr key={index}>
                                    <td>{items?.currentYear}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.total_loan_amount)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.loanamount_fixed)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.loanamount_variable)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{items?.Loan_interest_fixed?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{items?.Loan_interest_variable?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.totalLoan_interest_fixed)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.totalLoan_interest_variable)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.total_loan_interest)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.principal_payment_fixed)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.principal_payment_fixed_cummulative)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.principal_payment_variable)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.principal_payment_variable_cummulative)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.total_principal_payment)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.totalprincipalpaymentcummulative)?.toLocaleString()}</td>
                                    <td>{(items?.property_manag_perc)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.total_property_manage_fee)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.building_insuar)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.water_rates)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.Council_rates)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.maintaince_allownce)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.forcast_annual_cash_exp)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.land_tax)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.principal_payment_fixed)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.principal_payment_variable)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.principal_pay)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.forcast_annual_non_deductexpe)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.potential_annual_net_cash_outflow)?.toLocaleString()}</td>
                                    <td>
                                      <div className="d-flex justify-content-center gap-2">
                                        <a href="#" className="btn btn-sm btn-outline-primary" onClick={(e) => { e.preventDefault(); handleEditClick(index) }}><i className="ri-pencil-fill"></i></a>
                                        {showactionbtns[index] ? <>
                                          <a href="#" className="btn btn-sm btn-outline-success" onClick={(e) => { e.preventDefault(); submitMainatianancedata(index) }}><i className="ri-checkbox-circle-fill"></i></a>
                                          <a href="#" className="btn btn-sm btn-outline-warning" onClick={(e) => { e.preventDefault(); handleResetChanges(index) }} ><i className="ri-refresh-line"></i></a>
                                        </> : ""}
                                      </div>
                                    </td>
                                  </tr>
                                </>)
                              })}
                            </tbody>
                          </table>}
                        {showtable == "annalysis" &&
                          <table>
                            <thead className="thead-dark">
                              <tr>
                                {[
                                  { label: "Year", tooltip: "Year of calculation" },
                                  { label: "Estimated Property Value", tooltip: "Property value is the estimated worth of a real estate asset in the market." },
                                  { label: "Equity", tooltip: "Equity in real estate refers to the difference between the market value of a property and the amount still owed on any mortgages." },
                                  {
                                    label: "Net Adjusted Income", tooltip: (
                                      <>
                                        <div style={{ maxWidth: "300px", whiteSpace: "normal", wordWrap: "break-word" }}>
                                          <strong>Income after adjustments</strong> <br />
                                          Net Adjusted Income from a property refers to the total income generated by the property after accounting for all income, operating expenses, and adjustments.
                                          <br />
                                          <br />
                                          <strong>Formula:</strong>
                                          <br />
                                          Net Adjusted Income = Gross Rental Income - Operating Expenses + Adjustments (e.g., tax deductions, vacancies, etc.)
                                        </div>

                                      </>
                                    ),
                                  },
                                  {
                                    label: "Gross Yield %", tooltip: (
                                      <>
                                        <strong>Gross Yield in a Property</strong> <br />
                                        Gross Yield refers to the annual income (typically from rent) as a percentage of the property’s purchase price or market value. It’s a quick way to assess the return on investment (ROI) before accounting for expenses.
                                        <br />
                                        <br />
                                        <strong>Formula:</strong>
                                        <br />
                                        Gross Yield = (Annual Gross Rental Income ÷ Property Price) × 100
                                      </>
                                    ),
                                  },
                                  {
                                    label: "Cash Outflows", tooltip: (
                                      <>
                                        <strong>Cash Outflow</strong> <br />
                                        Cash outflow refers to the money spent on expenses like mortgage payments, taxes, insurance, maintenance, and property management. It’s crucial for calculating the net cash flow and profitability of a property.
                                      </>
                                    ),
                                  },
                                  { label: "Fixed Interest Repayment", tooltip: "Interest portion of fixed portion of the loan." },
                                  { label: "Variable Interest Repayment", tooltip: "Interest portion of variable portion of the loan" },
                                  { label: "Total Interest Repayment", tooltip: "Total interest payment on the loan." },
                                  {
                                    label: "Operating Expenses", tooltip: (
                                      <>
                                        <strong>Operating expenses</strong> <br />
                                        are the costs associated with the day-to-day management and maintenance of a property. These expenses are necessary to keep the property functional, rentable, and in good condition.
                                        <br />
                                        <br />
                                        <strong>Include:</strong>
                                        <br />
                                        Property management fees
                                        Maintenance and repairs
                                        Utilities (if paid by the owner) etc
                                      </>
                                    )
                                  },
                                  {
                                    label: "Net Annual Cash Flow", tooltip: (
                                      <>
                                        <strong>Net Annual Cash Flow</strong> <br />
                                        in real estate is the total income generated by a property in a year after all operating expenses, loan payments, and other costs are subtracted from the gross rental income.
                                        <br />
                                        <br />
                                        <strong>Formula:</strong>
                                        <br />
                                        Net Annual Cash Flow = Gross Rental Income - Operating Expenses - Loan Payments (mortgage, interest, etc.)
                                      </>
                                    )
                                  },
                                  {
                                    label: "Net Annual Cash Flow - Cumulative", tooltip: (
                                      <>
                                        <strong>Cumulative Net Annual Cash Flow</strong> <br />
                                        refers to the total cash flow (net of all expenses and loan payments) accumulated over multiple years.<br />
                                        <br />
                                        <strong>Formula:</strong>
                                        <br />
                                        Cumulative Net Annual Cash Flow = Net Annual Cash Flow of Year 1 + Net Annual Cash Flow of Year 2 + … + Net Annual Cash Flow of Year N
                                      </>
                                    )
                                  },
                                  {
                                    label: "Net Yield %", tooltip: (
                                      <>
                                        <strong>Net Yield</strong> <br />
                                        in real estate is a measure of the return on investment (ROI) after deducting all operating expenses, loan repayments, and other costs associated with owning and managing the property. It provides a more accurate picture of profitability than gross yield, as it accounts for expenses.<br />
                                        <br />
                                        <strong>Formula:</strong>
                                        <br />
                                        Net Yield = (Net Operating Income ÷ Property Purchase Price) × 100
                                      </>
                                    )
                                  },
                                  {
                                    label: "Capital Annual Growth", tooltip: (
                                      <>
                                        <strong>Capital Annual Growth</strong> <br />
                                        in real estate refers to the year-over-year increase in the market value of a property.  <br />
                                        <br />
                                        <strong>Formula:</strong>
                                        <br />
                                        Capital Annual Growth (%) = [(Current Property Value - Previous Property Value) ÷ Previous Property Value] × 100

                                      </>
                                    )
                                  },
                                  {
                                    label: "Capital Cumulative Growth", tooltip: (
                                      <>
                                        <strong>Capital Cumulative Growth</strong> <br />
                                        in real estate refers to the total compounded growth in the market value of a property over time, factoring in the annual appreciation or increase in value. Cumulative means adding each year's growth to the previous year's value, so that each year's increase is applied to the total value. <br />
                                        <br />
                                        <strong>Formula:</strong>
                                        <br />
                                        Capital Cumulative Growth = (Current Property Value ÷ Initial Property Value) - 1

                                      </>
                                    )
                                  },
                                  {
                                    label: "Total Performance", tooltip: (
                                      <>
                                        <strong>Total Performance</strong> <br />
                                        in real estate refers to the overall return on a property investment, combining both capital gains (property value increase) and income return (rental income or other income generated from the property). It reflects the complete financial performance of a property over time. <br />
                                        <br />
                                        <strong>Formula:</strong>
                                        <br />
                                        Total Performance = (Capital Gains + Income Return - Expenses) / Initial Investment
                                      </>
                                    )
                                  },
                                  {
                                    label: "Total Performance Including Principal Repayment", tooltip: (
                                      <>
                                        <strong>Total Performance Including Principal Repayment </strong> <br />
                                        in real estate refers to the overall return on a property investment, factoring in not just capital gains and income return, but also the repayment of the loan principal over time. This gives a fuller picture of the financial performance by including the amount of principal repaid on a mortgage, which increases the equity in the property. <br />
                                        <br />
                                        <strong>Formula:</strong>
                                        <br />
                                        Total Performance Including Principal Repayment = (Capital Gains + Income Return - Expenses + Principal Repayment) / Initial Investment
                                      </>
                                    )
                                  },
                                  {
                                    label: "Cash On Cash Returns %", tooltip: (
                                      <>
                                        <strong>Cash on Cash Return  </strong> <br />
                                        in real estate is a metric used to measure the annual return on an investment relative to the amount of cash invested. It provides investors with a clear picture of the cash income generated by the property in relation to their actual out-of-pocket investment. <br />
                                        <br />
                                        <strong>Formula:</strong>
                                        <br />
                                        Total Performance Including Principal Repayment = (Capital Gains + Income Return - Expenses + Principal Repayment) / Initial Investment
                                      </>
                                    )
                                  },
                                  {
                                    label: "Return On Invested Capital %", tooltip: (
                                      <>
                                        <strong>Total Performance Including Principal Repayment </strong> <br />
                                        in real estate refers to the overall return on a property investment, factoring in not just capital gains and income return, but also the repayment of the loan principal over time. This gives a fuller picture of the financial performance by including the amount of principal repaid on a mortgage, which increases the equity in the property. <br />
                                        <br />
                                        <strong>Formula:</strong>
                                        <br />
                                        Total Performance Including Principal Repayment = (Capital Gains + Income Return - Expenses + Principal Repayment) / Initial Investment
                                      </>
                                    )
                                  },
                                  { label: "Action", tooltip: "Available actions" },
                                ].map((column, index) => (
                                  <th key={index} title={column.tooltip}>
                                    {column.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {maintainncetableData?.map((items, index) => {
                                return (<>
                                  <tr key={index}>
                                    <td>{items?.currentYear}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.property_value)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.equity)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.gross_income)?.toLocaleString()}</td>
                                    <td>{(items?.grossyield)?.toFixed(3)}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.cashoutflow)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.interest_expense_fixed)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.interest_expense_variable)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.total_interest_expence)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.operating_expenses)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.net_annual_cash_flow)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.net_annual_cashflow_cummulative)?.toLocaleString()}</td>
                                    <td>{(items?.netyeild)?.toFixed(3)}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.capital_growth_annual)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.capital_growth_annual_cummulative)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.total_performance)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.total_performance_principal)?.toLocaleString()}</td>
                                    <td>{(items?.cash_on_cash_return)?.toLocaleString()}</td>
                                    <td>{(items?.return_interest_capital)?.toLocaleString()}</td>
                                    <td>
                                      <div className="d-flex justify-content-center gap-2">
                                        <a href="#" className="btn btn-sm btn-outline-primary" onClick={(e) => { e.preventDefault(); handleEditClick(index) }}><i className="ri-pencil-fill"></i></a>
                                        {showactionbtns[index] ? <>
                                          <a href="#" className="btn btn-sm btn-outline-success" onClick={(e) => { e.preventDefault(); submitMainatianancedata(index) }}><i className="ri-checkbox-circle-fill"></i></a>
                                          <a href="#" className="btn btn-sm btn-outline-warning" onClick={(e) => { e.preventDefault(); handleResetChanges(index) }} ><i className="ri-refresh-line"></i></a>
                                        </> : ""}
                                      </div>
                                    </td>
                                  </tr>
                                </>)
                              })}
                            </tbody>
                          </table>}
                        {showtable == 'summary' &&
                          <Summary></Summary>
                        }
                      </div>
                    </>
                      :
                      <div className="text-center">
                        No Data Found
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="actualReadingsModal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="flat-account bg-surface">
                <div className="text-center mb-4">
                  <h6>Actual Readings</h6>
                </div>
                <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                <div className='conatiner'>
                  <div className='row p-3'>
                    <label>Growth Assumption</label>
                    <input placeholder="Growth assumption" name="growth_assump"
                      value={showinputs.growth_assump}
                      onChange={(e) => handleChangeInput(e, selectedRowIndex)}
                      defaultValue={selectedObject?.growth_assump}
                      className="form-control mb-2"
                    />
                    <label>Rental Growth </label>
                    <input placeholder=" Rental growth" name="rental_growth"
                      value={showinputs.rental_growth}
                      onChange={(e) => handleChangeInput(e, selectedRowIndex)}
                      defaultValue={selectedObject?.rental_growth}
                      className="form-control mb-2"
                    />
                    <label>Inflation</label>
                    <input placeholder="Inflation" name="inflation"
                      value={showinputs.inflation}  // Use showinputs to populate the values
                      onChange={(e) => handleChangeInput(e, selectedRowIndex)}
                      defaultValue={selectedObject?.inflation}
                      className="form-control mb-2"
                    />
                    <label>Weekly Rental Income</label>
                    <input placeholder=" Weekly Rental Income" name="weekly_rental_income"
                      value={showinputs.weekly_rental_income}  // Use showinputs to populate the values
                      onChange={(e) => handleChangeInput(e, selectedRowIndex)}
                      defaultValue={(selectedObject?.weekly_rental_income)?.toFixed(3)}
                      className="form-control mb-2"
                    />
                    <label>Vacant Week</label>
                    <input placeholder="Vacant Weeks" name="vacant_week"
                      value={showinputs.vacant_week}  // Use showinputs to populate the values
                      onChange={(e) => handleChangeInput(e, selectedRowIndex)}
                      defaultValue={selectedObject?.vacant_week}
                      className="form-control mb-2"
                    />
                    <label>Letting Fees</label>
                    <input placeholder="Letting Fee Weeks" name="letting_fee_weeks"
                      value={showinputs.letting_fee_weeks}  // Use showinputs to populate the values
                      onChange={(e) => handleChangeInput(e, selectedRowIndex)}
                      defaultValue={selectedObject?.letting_fee_weeks}
                      className="form-control mb-2"
                    />
                    <label>Owner Occupied Week</label>
                    <input placeholder="Weeks owner occupied" name="owner_occupied_week"
                      value={showinputs.owner_occupied_week}  // Use showinputs to populate the values
                      onChange={(e) => handleChangeInput(e, selectedRowIndex)}
                      defaultValue={selectedObject?.owner_occupied_week}
                      className="form-control mb-2"
                    />
                    <label>Property Manangment Percent</label>
                    <input placeholder="Property managment percent" name="property_manag_perc"
                      value={showinputs.property_manag_perc}  // Use showinputs to populate the values
                      onChange={(e) => handleChangeInput(e, selectedRowIndex)}
                      defaultValue={selectedObject?.property_manag_perc}
                      className="form-control mb-2"
                    />
                    <label>Building Insurance</label>
                    <input placeholder="Building insaurance" name="building_insuar"
                      value={showinputs.building_insuar}  // Use showinputs to populate the values
                      onChange={(e) => handleChangeInput(e, selectedRowIndex)}
                      defaultValue={(selectedObject?.building_insuar)?.toFixed(3)}
                      className="form-control mb-2"
                    />
                    <label>Land Tax</label>
                    <input placeholder="Land Tax" name="land_tax"
                      value={showinputs.land_tax}  // Use showinputs to populate the values
                      onChange={(e) => handleChangeInput(e, selectedRowIndex)}
                      defaultValue={selectedObject?.land_tax}
                      className="form-control mb-2"
                    />
                  </div>
                  <button type="button" class="tf-btn primary" onClick={handleClose}>
                    Close
                  </button>
                  <button type="button" class="tf-btn primary"
                    onClick={() => { handleInputEditSubmit(selectedRowIndex) }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
export default MaintainnceTable
