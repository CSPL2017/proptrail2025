import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Chart } from "react-google-charts"
import Loader from "../utils/loader";
import { ApiService } from "../services/apiservices";
const ScenerioSummary = ({ scenerioTable }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [scenerioTableData, setScenerioTableData] = useState([]);
    const [showloader, setshowloader] = useState(false)
    const didMountRef = useRef(true);
    const { id } = useParams()
    const {
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (didMountRef.current) {
            if (location.pathname == `/scenerio/${id}`) {
                getScenerioData()
            } else {
                setScenerioTableData(scenerioTable)
            }
        }
        didMountRef.current = false;
    })

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

    function generateGraphOptions(title) {
        return {
            hAxis: {
                title: "year",
                format: '####',
                gridlines: {
                    count: 1,
                },
            },
            vAxis: {
                title: title,
            },
            chartArea: { width: "70%", height: "70%" },
            series: {},
        };
    }

    const data = [
        ["x", "Net Cashflow"],
        ...(scenerioTableData?.map((items, index) => [
            items?.currentYear,
            items?.net_annual_cash_flow,

        ])),
    ];

    const yielddata = [
        ["x", "gross yeild", "net yeild"],
        ...(scenerioTableData?.map((items, index) => [
            items?.currentYear,
            (items?.grossyield) * 100,
            (items?.netyeild) * 100,
        ])),
    ];

    const performancedata = [
        ["x", "Total Performance"],
        ...(scenerioTableData?.map((items, index) => [
            items?.currentYear,
            (items?.total_performance_principal),
            (items?.capital_growth_annual_cummulative),
            (items?.net_annual_cashflow_cummulative),
            (items?.totalprincipalpaymentcummulative),

        ])),
    ];

    const equitydata = [
        ["x", "Equity Projection",],
        ...(scenerioTableData?.map((items, index) => [
            items?.currentYear,
            (items?.equity),
        ])),
    ];

    const totalgrowthdata = [
        ["x", "Total Growth",],
        ...(scenerioTableData?.map((items, index) => [
            items?.currentYear,
            (items?.capital_growth_annual_cummulative),
        ])),
    ];

    const averagegrowthdata = [
        ["x", "Average growth",],
        ...(scenerioTableData?.map((items, index) => [
            items?.currentYear,
            (items?.capital_growth_annual_cummulative) / index,
        ])),
    ];
    
    function findFirstYearAbove100(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].return_interest_capital >= 100) {
                return data[i].currentYear - data[0].currentYear;
            }
        }
        return null;
    }
    return (<>
        <div className="container">
            <div className="row">
                {showloader && <Loader></Loader>}
                <div>
                    <table>
                        <thead>
                            <th>Strategy comparision</th>
                            <th>Years</th>
                            <th>Outcome</th>

                        </thead>
                        <tbody>
                            <tr>
                                <td>You would be able to achieve your equity target of $  </td>
                                <td> 4 years</td>
                                <td>You will be able to meet your target with this property </td>
                            </tr>
                            <tr>
                                <td>You would be able to achieve your equity target of $ </td>
                                <td> 4 years</td>
                                <td>You will be able to meet your target with this property </td>
                            </tr>
                        </tbody>


                    </table>
                </div>
                <div className="col-5">
                    <table>
                        <thead>
                            <tr>Performance Assumption</tr>
                            <tr>
                                <th>Total performance (growth + net cashflow )</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scenerioTableData.map((data, index) => {
                                if ((index) % 5 === 0) {
                                    return (
                                        <tr key={index}>
                                            <td>Year {data?.currentYear}</td>
                                            <td>{(data?.total_performance_principal).toFixed(2)}</td>
                                        </tr>
                                    );
                                } else {
                                    return null;
                                }
                            })}

                        </tbody>
                        <thead>
                            <tr>
                                <th>Return on Invested Capital</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scenerioTableData.map((data, index) => {

                                if ((index) % 5 === 0) {
                                    return (
                                        <tr key={index}>
                                            <td>Year {data?.currentYear}</td>
                                            <td>{(data?.return_interest_capital)?.toFixed(2)}%</td>

                                        </tr>
                                    );
                                } else {
                                    return null;
                                }
                            })}

                        </tbody>
                        <thead>
                            <tr>
                                <th>Initial Capital return in </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>{findFirstYearAbove100(scenerioTableData)} years</tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-7">
                    {/* <Chart
                        chartType="LineChart"
                        width="100%"
                        height="400px"
                        data={performancedata}
                        options={generateGraphOptions('total performance inc pr , capital growth (cummulative) , Net annual cashflow (cummulative) ,total principal payment (cummulative)')}
                    />
                    <p>Total performance Graph</p> */}
                    <Chart
                        chartType="LineChart"
                        width="100%"
                        height="400px"
                        data={data}
                        options={generateGraphOptions('Net Annual Cashflow')}
                    />
                    <p>Net annual cashflow</p>
                    <Chart
                        chartType="LineChart"
                        width="100%"
                        height="400px"
                        data={yielddata}
                        options={generateGraphOptions('yeilds')}
                    />
                    <p>Yeilds</p>
                    <Chart
                        chartType="LineChart"
                        width="100%"
                        height="400px"
                        data={totalgrowthdata}
                        options={generateGraphOptions('Total Growth')}
                    />
                    <p>Total Growth</p>
                    <Chart
                        chartType="AreaChart"
                        width="100%"
                        height="400px"
                        data={averagegrowthdata}
                        options={generateGraphOptions('Average Growth')}
                    />
                    <Chart
                        chartType="AreaChart"
                        width="100%"
                        height="400px"
                        data={equitydata}
                        options={generateGraphOptions('Equity Projection')}
                    />
                </div>
            </div>

        </div>


    </>)
}

export default ScenerioSummary