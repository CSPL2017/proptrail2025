import { useState, useEffect } from 'react';
import { ApiService } from '../services/apiservices';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SpinnerLoader from '../utils/loader';
function SearchTagModal({ propertyId }) {
    const navigate = useNavigate()
    const [showloader, setshowloader] = useState(false);
    const [errormsg, seterrormsg] = useState('');
    const [errorvaluemsg, seterrorvaluemsg] = useState('');

    const [tags, setTags] = useState([{ tagName: '', tagValue: '', tagNameOther: '' }]);

    useEffect(() => {
        const modalEl = document.getElementById("SearchTagModal");

        if (modalEl) {
            const handleShow = () => {
                if (propertyId) {
                    getPropertydata(propertyId);
                }
            };

            modalEl.addEventListener("shown.bs.modal", handleShow);

            return () => {
                modalEl.removeEventListener("shown.bs.modal", handleShow);
            };
        }
    }, [propertyId]);

    const savePropertyTag = () => {
        setshowloader(true);
        for (let tag of tags) {
            if (!tag.tagName) {
                seterrormsg('Please select the tag name');
                setshowloader(false);
                return;
            }
            if (tag.tagName === 'Other' && !tag.tagNameOther) {
                seterrormsg('Please enter the name of the other tag');
                setshowloader(false);
                return;
            }
            if (!tag.tagValue) {
                seterrorvaluemsg('Please enter the value of the tag name');
                setshowloader(false);
                return;
            }
        }
        if (tags.length > 3) {
            toast.error('Maximum 3 tags are allowed');
            setshowloader(false);
            return;
        }
        const formattedTags = tags.map(tag => ({
            tagName: tag.tagName === 'Other' ? tag.tagNameOther : tag.tagName,
            tagValue: tag.tagValue
        }));

        const dataString = {
            property_id: propertyId,
            property_tags: formattedTags
        };

        ApiService.postData('/createPropertyTag', dataString).then((res) => {
            setshowloader(false);
            if (res.status === 'success') {
                toast.success(res.message);
                window.location.reload();
            } else if (res.status === 'error' && (res.message === 'session_expired' || res.message === 'Account Inactive')) {
                toast.error(res.message);
                localStorage.removeItem('USER_TOKEN');
                navigate('/');
            } else {
                toast.error(res.message);
            }
        }).catch((error) => {
            setshowloader(false);
            toast.error('Something went wrong, please try again.');
            console.error(error);
        });
    };

    const getPropertydata = () => {
        const dataString = {
            property_id: propertyId
        }
        setshowloader(true)
        ApiService.postData('/property/getpropertyaddressdata', dataString).then((res) => {
            if (res.status === 'success') {
                if (Array.isArray(res.property.property_tags)) {
                    const formattedTags = res.property.property_tags.length > 0 ? res.property.property_tags.map(tag => ({
                        tagName: tag.tagName,
                        tagValue: tag.tagValue,
                        tagNameOther: tag.tagNameOther || '',
                        _id: tag._id
                    })) : [{ tagName: '', tagValue: '', tagNameOther: '' }];

                    setTags(formattedTags);
                }
                setshowloader(false)
            }
        })
    }

    const handleTagChange = (e, index, field) => {
        const updatedTags = [...tags];
        updatedTags[index][field] = e.target.value;
        setTags(updatedTags);
    };

    const addTag = () => {
        if (tags.length >= 3) {
            seterrormsg('You can only add 3 tags.');
            return;
        }
        setTags([...tags, { tagName: '', tagValue: '', tagNameOther: '' }]);
        seterrormsg('');
    };

    const removeTag = (index) => {
        const updatedTags = tags.filter((_, i) => i !== index);
        setTags(updatedTags);
    };

    return (<>
        {showloader && <SpinnerLoader />}
        <div className="modal fade" id="SearchTagModal">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="flat-account bg-surface">
                        <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                        <div className="container">
                            <div className="row">
                                {tags.map((tag, index) => (
                                    <>
                                        <div className="form-group" key={index}>
                                            <select
                                                name="tag_name"
                                                className="custom-select"
                                                value={tag.tagName}
                                                onChange={(e) => handleTagChange(e, index, 'tagName')}
                                            >
                                                <option value="">Select Tag Name</option>
                                                <option value="Name">Name</option>
                                                <option value="Location">Location</option>
                                                <option value="ClientName">Client Name</option>
                                                <option value="ClientId">Client Id</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errormsg && !tag.tagName && <span className="text-danger">{errormsg}</span>}

                                            {tag.tagName === 'Other' && (
                                                <div className="form-group">
                                                    <input
                                                        name="tag_name"
                                                        value={tag.tagNameOther}
                                                        onChange={(e) => handleTagChange(e, index, 'tagNameOther')}
                                                        placeholder="Enter other tag name"
                                                    />
                                                    {errormsg && tag.tagName && !tag.tagNameOther && (
                                                        <span className="text-danger">{errormsg}</span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <input
                                                    name="tag_value"
                                                    value={tag.tagValue}
                                                    onChange={(e) => handleTagChange(e, index, 'tagValue')}
                                                    placeholder="Enter tag value"
                                                />
                                                {errorvaluemsg && !tag.tagValue && <span className="text-danger">{errorvaluemsg}</span>}


                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'end' }}>
                                                <i className="ri-delete-bin-line fs-6" style={{ color: 'red' }} onClick={() => removeTag(index)}></i>
                                            </div>
                                        </div>
                                    </>
                                ))}
                                {tags.length < 3 && <div className="formgroup mb-20">
                                    <button
                                        className="btn btn-primary btn-full btn-lg"
                                        disabled={showloader}
                                        onClick={addTag}
                                    >
                                        {showloader ? (
                                            <img src="/img/loder01.gif" width="60px" height="11px" />
                                        ) : (
                                            'Add More Tag'
                                        )}
                                    </button>
                                </div>}


                                <div className="formgroup mb-20">
                                    <button className="btn btn-success btn-full btn-lg" onClick={savePropertyTag}>
                                        {showloader ? (
                                            <img src="/img/loder01.gif" width="60px" height="11px" />
                                        ) : (
                                            'Save Tags'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default SearchTagModal