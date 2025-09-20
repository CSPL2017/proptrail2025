import DataContext from "../../component/elements/context"
import Header from "../../component/header"
import { useContext } from "react"

const HelpSupport = () => {
    const contextValues = useContext(DataContext)
    return (<>
        <Header />
        <div className="layout-wrap">
            <div className="main-content-inner">
                <div className="widget-box-2">
                    <h6 className="title">Help & Support</h6>
                    <div className="row g-3 justify-content-center mb-4">
                        <div className="row">
                            <div className="col-lg-9">
                                <div className="acpanel"> 
                                    <div className="acpanel-body">
                                        <div className="p-5 helpbox text-center">
                                            <img
                                                className="img-fluid mb-2"
                                                src="/img/help.webp"
                                                style={{ width: "200px" }}
                                            ></img>
                                            <h6>How can we help you today?</h6>
                                            <p className="tx-color-02 tx-13 mb-0">
                                                Our customer service team will be able to assist you
                                                with any order or query
                                            </p>
                                        </div>
                                        <div className="aclist">
                                            <ul>
                                                <li>
                                                    <a
                                                        href={`mailto:${contextValues.settingData.admin_administration_email}`}
                                                        target="new"
                                                    >
                                                        <div className="aclist-icon">
                                                            <img src="/img/email.png"></img>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0">Email Us</p>
                                                            <span className="tx-color-02 tx-11">
                                                                Write to Proptrail directly for any
                                                                query
                                                            </span>
                                                        </div>
                                                        <i className="d-icon-angle-right"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href={`tel:${contextValues.settingData.admin_mobile}`}
                                                        target="new"
                                                    >
                                                        <div className="aclist-icon">
                                                            <img src="/img/hphone.png"></img>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0">Call Us</p>
                                                            <span className="tx-color-02 tx-11">
                                                                Get in touch and we will be happy to help
                                                                you
                                                            </span>
                                                        </div>
                                                        <i className="d-icon-angle-right"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href={`https://wa.me/${contextValues?.settingData?.admin_watsapp_no?.replace(/\s+/g, '')}`}
                                                        target="new"
                                                    >
                                                        <div className="aclist-icon">
                                                            <img src="/img/whatsapp.png"></img>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0">Whatsapp</p>
                                                            <span className="tx-color-02 tx-11">
                                                                Get in touch and we will be happy to help
                                                                you
                                                            </span>
                                                        </div>
                                                        <i className="d-icon-angle-right"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default HelpSupport