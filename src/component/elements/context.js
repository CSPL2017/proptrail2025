import React, { createContext, useEffect, useState, useRef } from 'react';
import { ApiService } from '../services/apiservices';

const DataContext = createContext();
export const DataProvider = ({ children }) => {
  const [settingImageBaseUrl, setSettingImageBaseUrl] = useState('');
  const [settingData, setSettingData] = useState([]);
  const [rowUserData, setRowUserData] = useState({});
  const [Currency, setCurrency] = useState('');
  const [address, setAddress] = useState('');
  const [UserToken, setUserToken] = useState(localStorage.getItem('USER_TOKEN'));
  const [toggleScenerio, setToggleScenerio] = useState(false);
  const [toggleChnageScenerio, setToggleChangeScenerio] = useState(false);
  const [toggleAddAddress, setToggleAddAddress] = useState(false);
  const [toggletrackModal, setToggletrackModal] = useState(false);
  const [toggleSearchTag , setToggleSearchTag ] = useState(false);
  const didMountRef = useRef(true);
  useEffect(() => {
    if (didMountRef.current) {
     
      getSettingData()

    }
    didMountRef.current = false;
  }, [])
  const getSettingData = () => {
    try {
      ApiService.fetchData('admin/getadminsettingdata').then((res) => {
        if (res.status === 'success') {
          setSettingData(res.data)
          setSettingImageBaseUrl(res.setting_img_path)
          setCurrency(res.data.admin_Property_currency)
        }
      })
    } catch (error) {
      console.error('An error occurred while fetching blog data:', error);
    }
  }
 
  return (
    <DataContext.Provider value={
      {
        settingData, setSettingData,
        settingImageBaseUrl, setSettingImageBaseUrl,
        UserToken, setUserToken,
        rowUserData,setRowUserData,
        toggleScenerio,setToggleScenerio,
        toggleChnageScenerio,setToggleChangeScenerio,
        toggleSearchTag,setToggleSearchTag,
        Currency,setCurrency,
        toggleAddAddress,setToggleAddAddress,
        toggletrackModal,setToggletrackModal,
        address,setAddress
      }
    }>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;