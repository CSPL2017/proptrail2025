
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Accountsidebar from "./account_sidebar";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import SweetAlert from "react-bootstrap-sweetalert";
import Loader from "../../component/utils/loader";
import DataContext from "../../component/elements/context";
import { ApiService } from "../../component/services/apiservices";
import Header from "../../component/header";
import ScenerioModal from "../../component/modal/scenerio_modal";
import SearchTagModal from "../../component/modal/search_tag_modal";
import AddAddressModal from "../../component/modal/add_property_address";
import PropertyAddress from "../../component/modal/property_address_modal";

const TrackProperties = () => {
  const contextValues = useContext(DataContext)
  const [show, setShow] = useState(false);
  const navigate = useNavigate()
  const [myproperties, setmyproperties] = useState([])
  const [deleteId, setdeleteId] = useState({});
  const [showReset, setShowReset] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [IsLoading, setIsLoading] = useState(false);
  const [propertyId, setpropertyId] = useState('');
  const [property_img_url, setpropertyImgUrl] = useState(null);
  const [hasMore, setHasmore] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const didMountRef = useRef(true);
  useEffect(() => {
    if (didMountRef.current) {
      fetchProperties()
    }
    didMountRef.current = false;
  }, [])

  const getMyPropertyData = () => {
    let pageNumber = 1
    setIsLoading(true)
    ApiService.postData(`/getpropertylist?page=${pageNumber}`, { propertytrackstatus: 1 })
      .then((res) => {
        if (res.status === 'success') {
          const { propertyList, currentPage, totalPages } = res;
          setmyproperties((prevProperties) => [
            ...prevProperties,
            ...propertyList,
          ]);
          setIsLoading(false)

        } else if (res.status === 'error' && (res.message === 'session_expired' || res.message === 'Account Inactive')) {
          localStorage.removeItem('USER_TOKEN');
          navigate('/');
        }
        else {
          setIsLoading(false)
        }

      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error fetching properties:', error);
      });
  };

  const deleteproperty = (itemid) => {
    const dataString = {
      purchase_id: deleteId._id,
      property_id: deleteId.property_data._id
    }
    ApiService.postData('/deleteproperty', dataString).then((res) => {
      if (res?.status == "success") {
        toast.success(res.message)
        setTimeout(() => {
          setShow(false)
          fetchProperties('delete')
          setHasmore(true)
        }, 500)
      } else if (res?.status == "error" && res.message == 'session_expired') {
        toast.error(res?.data?.message)
        localStorage.removeItem("USER_TOKEN")
        navigate('/')
      }
      else {
        setShow(false)
        toast.error(res?.message)
      }
    }).catch((error) => { setShow(false) })

  }
  const onDeleteProp = (item) => {
    setdeleteId(item)
    setShow(!show)
  }
  const scenerioModal = (id) => {
    setpropertyId(id)
    contextValues.setToggleScenerio(!contextValues.toggleScenerio)
  }
  const handleClose = () => {
    contextValues.setAddress('')
    contextValues.setToggletrackModal(false)
  }


  const fetchProperties = (type = "") => {
    let pageNumber = type === "delete" ? 1 : Math.ceil(myproperties.length / 10) + 1;
    setIsLoading(true)
    if (searchQuery.length > 2) {
      setShowReset(true)
      ApiService.postData(`/searchPropertiesByTag?page=${pageNumber}`, { tagValue: searchQuery, propertytrackstatus: 1 })
        .then(handleResponse)
        .catch(handleError);
    } else {
      ApiService.postData(`/getpropertylist?page=${pageNumber}`, { propertytrackstatus: 1 })
        .then(handleResponse)
        .catch(handleError);
    }
  };
  const handleResponse = (res) => {

    if (res.status === "success") {
      const { propertyList, currentPage, totalPages, property_img_url } = res;
      setmyproperties((prev) => (currentPage === 1 ? propertyList : [...prev, ...propertyList]));
      setHasmore(currentPage < totalPages);
      setpropertyImgUrl(property_img_url);
      setIsLoading(false)
    } else if (res.status === "error" && (res.message === "session_expired" || res.message === "Account Inactive")) {
      localStorage.removeItem("USER_TOKEN");
      navigate("/");
      setIsLoading(false)
    }
    else {
      setIsLoading(false)
    }
  };
  const handleError = (error) => {
    setIsLoading(false)
    console.error("Error fetching properties:", error);
  };
  const reSet = () => {
    setSearchQuery("");
    setShowReset(false)
    setmyproperties([])
    getMyPropertyData("delete");
  };

  const addAddressModal = () => {
    contextValues.setToggleAddAddress(!contextValues.toggleAddAddress)
  }

  return (<>
    <Header />
    <div className="layout-wrap">
      <div className="main-content-inner">
        <div className="widget-box-2">
          <div className="row g-3 justify-content-center mb-4">
            <div className="col-lg-12">
              <div className="ccpanel">
                <div className="ccpanel-header d-flex justify-content-between">
                  <h6 className="title">Track My Properties</h6>
                  <a href="#addPropertyAddressModal" data-bs-toggle="modal" className="tf-btn primary">
                    Add Property
                  </a>
                </div>
                <div className="wrap-table">
                  <div className="table-responsive">
                    {IsLoading ?
                      <div className="text-center">
                        <Loader></Loader>
                      </div>
                      :
                      myproperties.length > 0 ?
                        <InfiniteScroll
                          dataLength={myproperties.length}
                          next={fetchProperties}
                          hasMore={hasMore}
                          loader={<h6>Loading...</h6>}
                          style={{ overflow: "hidden !important" }}
                        >
                          <table>
                            <thead className="thead-dark">
                              <tr>
                                <th>Title</th>
                                <th>Equity</th>
                                <th>Net Annual Cashflow</th>
                                <th>Date Published</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {myproperties.length > 0 &&
                                myproperties.map((item, key) => {
                                  const date1 = new Date(item.property_data.created_at).toDateString();
                                  return (
                                    <tr key={key}>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-start" >
                                          <img
                                            src={item?.property_data?.property_image ? property_img_url + item?.property_data?.property_image : '/img/logo.png'}
                                            alt="Property"
                                            className="img-thumbnail me-3"
                                            style={{ width: "80px", height: "auto" }}
                                          />
                                          <div>
                                            <a
                                              href={`/maintainance/${item?.property_data?._id}`}
                                              className="fw-bold text-decoration-none"
                                            >
                                              {item?.property_data?.property_name}
                                            </a>
                                            <div className="text-muted small">{item?.property_data?.property_adress}</div>

                                          </div>
                                        </div>
                                      </td>
                                      <td>{contextValues.Currency ? contextValues.Currency : '$'}{(item.maintenance_data.equity)?.toFixed(3)}</td>
                                      <td>{contextValues.Currency ? contextValues.Currency : '$'}{(item.maintenance_data.net_annual_cash_flow)?.toFixed(3)}</td>
                                      <td>{date1}</td>
                                      <td>
                                        <div className="d-flex justify-content-center gap-2">
                                          <a href="javascript:void(0)" className="btn btn-sm btn-outline-danger remove-file" onClick={() => { onDeleteProp(item) }}><i className="ri-delete-bin-fill"></i></a>
                                          <a href={`/createscenerio/${item?.property_data?._id}`} className="btn btn-sm btn-outline-success remove-file">WhatIf</a>
                                          <a href="#scenerioModal" data-bs-toggle="modal" className="btn btn-sm btn-outline-warning remove-file" onClick={() => { scenerioModal(item?.property_data?._id) }} >Scenerios </a>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </InfiniteScroll> : <p className="text-center">{' No Property Found'}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SweetAlert
      warning
      confirmBtnCssClass="alertpop"
      title={` Are you sure you want to delete this property ? `}
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      show={show}
      onConfirm={deleteproperty}
      onCancel={onDeleteProp}
      btnSize="md"
      showCancel
      cancelBtnBsStyle="danger"
    ></SweetAlert>
    <ScenerioModal propertyId={propertyId}></ScenerioModal>
    <AddAddressModal />
  </>)
}

export default TrackProperties