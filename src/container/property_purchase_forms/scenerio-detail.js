import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataContext from "../../component/elements/context.js";
import { ApiService } from "../../component/services/apiservices.js";
import Header from "../../component/header/index.js";
import Footer from "../../component/footer/index.js";
import ScenerioSummary from "../../component/scenerio_summary_annalysis/index.js";

const ScenerioDetail = () => {
  const { id } = useParams()
  const contextValues = React.useContext(DataContext)
  const [scenerioTableData, setScenerioTableData] = useState([]);
  const [showtable, setshowtable] = useState("summary")
  const [showloader, setshowloader] = useState(false)
  const navigate = useNavigate()
  const didMountRef = useRef(true);

  useEffect(() => {
    if (didMountRef.current) {
      getScenerioData()
    }
    didMountRef.current = false;
  }, [])

  const getScenerioData = () => {
    let dataString = {
      scenerio_id: id
    }
    ApiService.postData(`/property/getsceneriodetail`, dataString)
      .then((res) => {
        if (res.status === 'success') {
          setScenerioTableData(res.scenerodetail.scenerio_table_data)
        } else if (res.status === 'error' && (res.message === 'session_expired' || res.message === 'Account Inactive')) {
          localStorage.removeItem('USER_TOKEN');
          navigate('/');
        }

      })
      .catch((error) => {
        console.error('Error fetching properties:', error);
      });
  };
  return (<>
    <Header />
    <div className="layout-wrap">
      <div className="main-content-inner">
        <div className="widget-box-2">
          <div className="row g-3 justify-content-center mb-4">
            <div className="col-12">
              <div style={{ overflowX: 'auto', width: '100%' }} className="mt-5">
                <div className="wrap-table">
                  <div>
                    <ul className="nav nav-tabs nav-fill">
                      <li className="nav-item">
                        <a className={`nav-link ${showtable === "detailedassumption" ? "active" : ""}`} onClick={() => setshowtable("detailedassumption")}>
                          Detailed Assumption(s)
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className={`nav-link ${showtable === "incomeoveryear" ? "active" : ""}`} onClick={() => setshowtable("incomeoveryear")}>
                          Income
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className={`nav-link ${showtable === "expenses" ? "active" : ""}`} onClick={() => setshowtable("expenses")}>
                          Expenses
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className={`nav-link ${showtable === "annalysis" ? "active" : ""}`} onClick={() => setshowtable("annalysis")}>
                          Analysis
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className={`nav-link ${showtable === "summary" ? "active" : ""}`} onClick={() => setshowtable("summary")}>
                          Summary
                        </a>
                      </li>
                    </ul>
                  </div>
                  {scenerioTableData.length > 0 ?
                    <>
                      <div className="table-responsive">
                        {showtable == "detailedassumption" &&
                          <table>
                            <thead>
                              <tr>
                                <th>year</th>
                                <th>Estimate/Actual</th>
                                <th>Growth Assumption</th>
                                <th>Rental Growth</th>
                                <th>Inflation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {scenerioTableData?.map((item, index) => {
                                return (<>
                                  <tr key={index}>
                                    <td>{item.currentYear}</td>
                                    <td>{item.estimate_heading == "0" ? "Estimate" : item?.estimate_heading == "1" ? "Actual" : ""}</td>
                                    <td>{item.growth_assump + "%"}</td>
                                    <td>{item.rental_growth + "%"}</td>
                                    <td>{item.inflation + "%"}</td>
                                  </tr>
                                </>)
                              })}
                            </tbody>
                          </table>}
                        {showtable == "incomeoveryear" &&
                          <table>
                            <thead>
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
                              </tr>
                            </thead>
                            <tbody>
                              {scenerioTableData?.map((items, index) => {
                                return (<>
                                  <tr key={index}>
                                    <td>{items?.currentYear}</td>
                                    <td>
                                      {contextValues.Currency ? contextValues.Currency : '$'}{(items?.weekly_rental_income)?.toLocaleString()}
                                    </td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.gross_annual_rental)?.toLocaleString()}</td>
                                    <td>
                                      {(items?.vacant_week)?.toFixed(3)}
                                    </td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.vacant_rate)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.rental_loss)?.toLocaleString()}</td>
                                    <td>
                                      {(items?.letting_fee_weeks)?.toFixed(3)}
                                    </td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.letting_fee)?.toLocaleString()}</td>
                                    <td>
                                      {(items?.owner_occupied_week)?.toFixed(3)}
                                    </td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.owner_rental_saved)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.adjusted_income)?.toLocaleString()}</td>
                                  </tr>
                                </>)
                              })}
                            </tbody>
                          </table>}
                        {showtable == "expenses" &&
                          <table>
                            <thead>
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
                                <th>Property Manangment % </th>
                                <th> Total Property Manangment</th>
                                <th> building Landloard Insurance</th>
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
                              </tr>
                            </thead>
                            <tbody>
                              {scenerioTableData?.map((items, index) => {
                                return (<>
                                  <tr key={index}>
                                    <td>{items?.currentYear}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.total_loan_amount)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.loanamount_fixed)?.toLocaleString()}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.loanamount_variable)?.toLocaleString()}</td>
                                    <td>{items?.Loan_interest_fixed}</td>
                                    <td>{items?.Loan_interest_variable}</td>
                                    <td>{(items?.totalLoan_interest_fixed)?.toLocaleString()}</td>
                                    <td>{(items?.totalLoan_interest_variable)?.toLocaleString()}</td>
                                    <td>{(items?.total_loan_interest)?.toLocaleString()}</td>
                                    <td>{(items?.property_manag_perc)?.toFixed(3)}</td>
                                    <td>{contextValues.Currency ? contextValues.Currency : '$'}{(items?.total_property_manage_fee)?.toFixed(3)}</td>
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
                                  </tr>
                                </>)
                              })}
                            </tbody>
                          </table>}
                        {showtable == "annalysis" &&
                          <table>
                            <thead>
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
                                        refers to the total cash flow (net of all expenses and loan payments) accumulated over multiple years.                            <br />
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
                                        in real estate is a measure of the return on investment (ROI) after deducting all operating expenses, loan repayments, and other costs associated with owning and managing the property. It provides a more accurate picture of profitability than gross yield, as it accounts for expenses.                           <br />
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
                                ].map((column, index) => (
                                  <th key={index} title={column.tooltip}>
                                    {column.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {scenerioTableData?.map((items, index) => {
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
                                    <td>{(items?.cash_on_cash_return)?.toFixed(3)}</td>
                                    <td>{(items?.return_interest_capital)?.toFixed(3)}</td>
                                  </tr>
                                </>)
                              })}
                            </tbody>
                          </table>}
                        {showtable == 'summary' &&
                          <ScenerioSummary scenerioTable={scenerioTableData}></ScenerioSummary>
                        }
                      </div>
                    </> : <div className="text-center">No Data Found</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>)
}


export default ScenerioDetail