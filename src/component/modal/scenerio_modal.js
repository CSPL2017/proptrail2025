import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/apiservices';
import SpinnerLoader from '../utils/loader';
function ScenerioModal({ propertyId }) {
    const navigate = useNavigate()
    const [isLoader, setIsLoader] = useState(false);
    const [scenerioList, setScenerioList] = useState([]);

    const getScenerioListData = useCallback(async (propertyId) => {
        try {
            let dataString = {
                property_id: propertyId
            }
            setIsLoader(true);
            const res = await ApiService.postData('/property/getsceneriolist', dataString);
            if (res.status === 'success') {
                setScenerioList(res.sceneroList)
            } else if (res.status === 'error' && (res.message === 'session_expired' || res.message === 'Account Inactive')) {
                localStorage.removeItem('USER_TOKEN');
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching available slot date-time data:', error);
        } finally {
            setIsLoader(false);
        }
    }, []);

    useEffect(() => {
        const modalEl = document.getElementById("scenerioModal");
        if (modalEl) {
            const handleShow = () => {
                if (propertyId) {
                    getScenerioListData(propertyId);
                }
            };
            modalEl.addEventListener("shown.bs.modal", handleShow);
            return () => {
                modalEl.removeEventListener("shown.bs.modal", handleShow);
            };
        }
    }, [propertyId]);

    return (<>
        {isLoader && <SpinnerLoader />}
        <div className="modal fade" id="scenerioModal">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="flat-account bg-surface">
                        <div className="text-center mb-4">
                            <h6>Property Scenerios</h6>
                        </div>
                        <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                        <div className='container'>
                            <div className="row g-3">
                                <div className="table-responsive">
                                    {scenerioList.length > 0 ?
                                        <table className="table table-striped table-bordered text-center">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th>Inflation</th>
                                                    <th>Rental Growth</th>
                                                    <th>Growth Assumption</th>
                                                    <th>Date Published</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {scenerioList.length > 0 &&
                                                    scenerioList.map((item, key) => {
                                                        const date1 = new Date(item.created_at).toDateString();
                                                        return (
                                                            <tr key={key}>
                                                                <td>
                                                                    {(item.inflation)?.toFixed(3)}
                                                                </td>
                                                                <td>{(item.rentalgrowth)?.toFixed(3)}</td>
                                                                <td>{(item.growthassumpt)?.toFixed(3)}</td>
                                                                <td>{date1}</td>
                                                                <td>
                                                                    <div className="d-flex justify-content-center gap-2">
                                                                        <a href={`/scenerio/${item?._id}`} className="btn btn-sm btn-outline-primary">
                                                                            <i className="ri-pencil-fill"></i>
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                        : <p className="text-center">No Scenerio Found</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default ScenerioModal