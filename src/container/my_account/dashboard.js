import React, { useState, useEffect, useContext, useRef } from "react";
import Header from "../../component/header"
import Accountsidebar from "./account_sidebar"
import { useNavigate } from "react-router-dom";
import { GaugeComponent } from 'react-gauge-component';
import { Chart } from "react-google-charts"
import DataContext from "../../component/elements/context";
import { ApiService } from "../../component/services/apiservices";
const Dashboard = () => {
    const contextValues = useContext(DataContext)
    const [dashboardData, setdashboardData] = useState();
    const [gaugechartvalue, setgaugecgartvalue] = useState(0);
    const [strategyDetail, setstrategyDetail] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    const didMountRef = useRef(true);
    useEffect(() => {
        if (didMountRef.current) {
            getDashboarddetail()
            fetchStretegydetail()
        }
        didMountRef.current = false;
    }, [])

    const getDashboarddetail = () => {
        setIsLoading(true)
        ApiService.fetchData("/dashboard").then((res) => {
            if (res?.status == "success") {
                setdashboardData(res);
                setIsLoading(false)
                let ratiovalue = 0;
                if (res.totalValue.totalloanamount && res.totalValue.totalpropertyvalue) {
                    ratiovalue = (res.totalValue.totalloanamount / res.totalValue.totalpropertyvalue) * 100;
                } else {
                    ratiovalue = 0;
                }
                setgaugecgartvalue(ratiovalue);
            }
            else if (res.status == 'error' && (res.message == 'session_expired' || res.message == 'Account Inactive')) {
                localStorage.removeItem('USER_TOKEN')
                window.location.href = '/'
                setIsLoading(false)
            }

            else {
                setIsLoading(false)
            }
        }).catch((error) => { })
    };
    function generateGraphOptions(title) {
        return {
            hAxis: {
                title: "Year",
                format: "####",
                gridlines: {
                    count: 5,
                },
            },
            vAxis: {
                title: title,
            },
            chartArea: { width: "70%", height: "70%" },
            series: {
                0: {
                    annotations: {
                        textStyle: {
                            fontSize: 12,
                            bold: true,
                            color: "#000",
                        }
                    }
                }
            },
            annotations: {
                alwaysOutside: true,
            },
            pointSize: 5,
            legend: { position: "none" },
        };
    }
    const data = [
        ["Year", "Net Cashflow", { role: "annotation" }],
        ...(Array.isArray(dashboardData?.cashflow)
            ? dashboardData?.cashflow.map(items => [
                items?.year,
                items?.netannualcashflow,
                items?.netannualcashflow?.toFixed(2)?.toString(),
            ])
            : []),
    ];
    const fetchStretegydetail = async () => {
        await ApiService.fetchData('/property/getstrategydetail').then(res => {
            if (res.status == "success") {
                if (res?.data) {
                    const data = res.data
                    setstrategyDetail(data)
                }
            } else if (res.status == 'error' && (res.message == 'session_expired' || res.message == 'Account Inactive')) {
                localStorage.removeItem('USER_TOKEN')
                window.location.href = '/'
                setIsLoading(false)
            }

        }).catch((errors) => { })
    }
    const getDebtEquityText = () => {
        let strategyRisk = strategyDetail.stra_risk_app;

        if (strategyRisk) {
            if (gaugechartvalue > 0 && gaugechartvalue <= 80) {
                return strategyRisk !== 'low'
                    ? 'Your Debt To Equity Ratio Does Not Meet Your Strategy'
                    : 'Your Debt To Equity Ratio Meets Your Strategy';
            }

            if (gaugechartvalue > 80 && gaugechartvalue <= 90) {
                return strategyRisk !== 'medium'
                    ? 'Your Debt To Equity Ratio Does Not Meet Your Strategy'
                    : 'Your Debt To Equity Ratio Meets Your Strategy';
            }

            if (gaugechartvalue > 90) {
                return strategyRisk !== 'high'
                    ? 'Your Debt To Equity Ratio Does Not Meet Your Strategy'
                    : 'Your Debt To Equity Ratio Meets Your Strategy';
            }
        } else {
            return ''
        }


    }
    return (<>
        <div class="layout-wrap">
            <Header />
            <Accountsidebar />
            <div class="main-content">
                <div class="main-content-inner">
                    <div class="widget-box-2">
                        <h6 class="title">Dashboard</h6>
                        <div className="row g-3 justify-content-center mb-4">
                            {[
                                { title: "Current Number of Properties", value: dashboardData?.propertyCount, icon: "/img/home.png" },
                                {
                                    title: "Current Total Portfolio Value",
                                    value: `${contextValues.Currency ? contextValues.Currency : '$'}${dashboardData?.totalValue?.totalpropertyvalue?.toLocaleString()}`,
                                    icon: "/img/chart.png"
                                },
                                { title: "Current Total Debt", value: `${contextValues.Currency ? contextValues.Currency : '$'}${dashboardData?.totalValue?.totalloanamount?.toLocaleString()}`, icon: "/img/coin.png" },
                                { title: "Current Total Equity", value: `${contextValues.Currency ? contextValues.Currency : '$'}${dashboardData?.totalValue?.totalequity?.toLocaleString()}`, icon: "/img/chart.png" }
                            ]
                                .map((item, index) => (
                                    <div key={index} className="col-6 col-sm-4 col-md-3 d-flex flex-column align-items-center" onClick={() => { navigate('/my-property') }}>
                                        <div
                                            className="counter-box d-flex flex-column justify-content-center align-items-center"
                                            style={{
                                                borderRadius: "50%",
                                                width: "130px",
                                                height: "130px",
                                                backgroundColor: "#f9f9f9",
                                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                textAlign: "center",
                                                padding: "10px",
                                            }}
                                        >
                                            <img src={item.icon} alt={item.title} width="30px" />
                                            <div style={{ marginTop: "10px", color: "#daa028", fontWeight: "bold" }}>
                                                <span style={{ fontSize: "12px" }}>{item.title}</span>
                                            </div>
                                            <h6 className="number mt-2" style={{ color: "#672d5f", fontWeight: "bold" }}>
                                                {item.value || "0"}
                                            </h6>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Gauge Chart and Line Chart Section */}
                        <div className="row g-3">
                            {getDebtEquityText() !== '' && <p className="text-danger text-end p-0 mb-0 fw-bold">{getDebtEquityText()}</p>}
                            <div className="col-12 col-md-8">
                                <Chart
                                    chartType="LineChart"
                                    width="100%"
                                    height="300px"
                                    data={data}
                                    options={generateGraphOptions("Net Annual Cashflow")}
                                />
                            </div>
                            <div className="col-12 col-md-4 d-flex justify-content-center">
                                <div>
                                    <GaugeComponent
                                        value={gaugechartvalue}
                                        type="radial"
                                        labels={{
                                            tickLabels: {
                                                type: "inner",
                                                ticks: [
                                                    { value: 80 },
                                                    { value: 90 },
                                                ],
                                            },
                                        }}
                                        arc={{
                                            colorArray: ["green", "orange", "red"],
                                            subArcs: [
                                                { limit: 80, color: "#5BE12C" },
                                                { limit: 90, color: "#F5CD19" },
                                                { color: "#EA4228" },
                                            ],
                                            padding: 0.02,
                                            width: 0.2,
                                        }}
                                        pointer={{
                                            elastic: true,
                                            animationDelay: 0,
                                        }}
                                    />
                                    <h6 className="text-center">Debt To Equity Ratio</h6>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
export default Dashboard