import { useContext, useState} from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng, } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import DataContext from '../elements/context';
function AddAddressModal() {
    const contextValues = useContext(DataContext)
    const [ErrorMessage, setErrorMessage] = useState('')
    const [latValue, setlatValue] = useState('')
    const [lngValue, setLngValue] = useState('')
    const navigate = useNavigate()
    const {
        reset,
        formState: { errors }
    } = useForm();
    const { ready, value, suggestions: { status, data }, setValue, clearSuggestions, } = usePlacesAutocomplete({
        callbackName: "YOUR_CALLBACK_NAME",
        requestOptions: {
            componentRestrictions: { country: 'au' } // Restrict suggestions to Australia
        },
        debounce: 300,
    });
    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });
    const handleInput = (e) => {
        setErrorMessage('')
        const inputValue = e.target.value;
        setValue(inputValue);
        contextValues.setAddress(inputValue);
        if (inputValue !== "" && inputValue.length > 2) {
            const myElement = document.getElementById("search");
            myElement.style.border = "";  // Resetting to default border style
        }
        else {
            contextValues.setAddress('')

        }
    };

    const handleClose = () => {
        setValue('')
        contextValues.setAddress('')
        reset()

        contextValues.setToggletrackModal(false)
    }

    const handleSelect =
        ({ description }) => {

            return () => {
                setValue(description, false);
                contextValues.setAddress(description);
                clearSuggestions();
                getGeocode({ address: description }).then((results) => {
                    const { lat, lng } = getLatLng(results[0]);
                    contextValues.setAddress(description);
                    setlatValue(lat)
                    setLngValue(lng)
                });
            };
        }


    const renderSuggestions = (e) => {
        if (contextValues.address.length > 2) {

            return data.map((suggestion) => {
                const {
                    place_id,
                    structured_formatting: { main_text, secondary_text },
                } = suggestion;
                return (
                    <li key={place_id} onClick={handleSelect(suggestion)}>
                        <strong>{main_text}</strong> <small>{secondary_text}</small>
                    </li>
                );
            });
        } else {

            return null;
        }
    }
    const navigateToAddressList = () => {
        setErrorMessage('')
        const segmentCount = contextValues.address.split(",").length;
        if (contextValues.address === "") {

            const myElement = document.getElementById("search");
            myElement.style.border = "1px solid red";
            return false;
        } else if (
            segmentCount >= 3
        ) {
            contextValues.setToggleAddAddress(false);
            contextValues.setToggletrackModal(true)
        }
        else {
            console.log("address3")
            setErrorMessage("Invalid address format Please select the complete address with street name , locality name ")
        }
    }; 

    return (<>
        <div className="modal fade" id="addPropertyAddressModal">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="flat-account bg-surface">
                        <div className="text-center mb-4">
                            <h6>Property Scenerios</h6>
                        </div>
                        <span className="close-modal icon-close2" data-bs-dismiss="modal"></span>
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-12">
                                    <div className="herobanner-content" ref={ref} >
                                        <h5 className="title">Track your cashflow With <span className="tx-primary">Proptrail</span></h5>
                                        <p>Curious about what your property cash flow looks like?</p>
                                        <div className="heroSearch mb-10" id="search">
                                            <div className="heroSearchIcon"><i className="ri-search-line"></i></div>
                                            <input type="text" placeholder="Search your address" value={value} onChange={(e) => { handleInput(e) }}></input>
                                            <button className="tf-btn primary" onClick={() => { navigateToAddressList() }}>Track</button>
                                            {status === "OK" && contextValues?.address?.length > 2 && <ul className="heroSearch-list">{renderSuggestions()}</ul>}
                                        </div>
                                        <p className="tx-12 tx-gray">Your address will not be shared with third parties.</p>
                                        {ErrorMessage !== '' ? <span className="text-danger">{ErrorMessage}</span> : ""}
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

export default AddAddressModal