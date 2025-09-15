import axios from 'axios';
import constant from './constant';

const saveaddressUrl = "property/saveaddress";
const savemaintainancedataUrl = "property/savemaintainancedata";
const savepurchasedetailUrl = "property/savepurchasedetail";
const savemaintainancetableUrl = "property/savemaintainanacetabledata";
const savenewmaintainanacetabledataUrl = "property/savenewmaintainanacetabledata"
const getpropertydataUrl = "property/getpropertydata";
const getpurchasedataUrl = "property/getpurchasedata";
const updatemaintainncetableUrl = "property/updatemaintainance_table";
const getsavedmaintainancetableurl = "property/getsavedmaintainancetabledata"
const getmaintainancetableUrl = "property/getmaintainancetabledata";
const getexceldownloadUrl = "property/getexceldownload"
const getdefaultvalueUrl = "admin/dashboard/getdefaultvalues"
const getnewsletterUrl = "enquiry/savenewsletter"
const getadminsettingdataUrl = "admin/getadminsettingdata"
const getuserloginUrl = "user/getlogin"
const getuserregisterUrl = "user/getregister"
const sendotpUrl = "user/sendotp"
const verifyotpUrl = "user/verifyotp"
const getresendotpUrl = "user/resendotp"
const getfeaturednewsbloglistUrl = 'admin/getfeaturednewsblogs'
const getallnewsbloglistUrl = 'admin/getallnewsblogs'
const getnewsblogdetailUrl = 'admin/getnewsblogdetail'
const getallfaqlistUrl = 'admin/getfaqlistdata'
const getappearancefooterdataUrl = 'admin/getfooterdata'

const client = axios.create({
  baseURL: constant.API_URL,
});

function getauthtoken() {
  const token = localStorage.getItem("USER_TOKEN")
  let Authtoken = '';
  if (token != null && token != '' && token != undefined) {
    Authtoken = token;
  }
  const config = {
    headers: { 'X-Authorization': `Bearer ${Authtoken}` }
  };
  return config;
}


export class ApiService {
  saveaddressPostRequest(request) {
    return client.post(saveaddressUrl, request, getauthtoken())
  }
  savemaintainancedataPostRequest(request) {
    return client.post(savemaintainancedataUrl, request)
  }
  savepurchasedetailPostRequest(request) {
    return client.post(savepurchasedetailUrl, request, getauthtoken())
  }
  savenewmainatinancetablePostRequest(request) {
    return client.post(savenewmaintainanacetabledataUrl, request, getauthtoken())
  }
  getpropertydataPostRequest(request) {
    return client.post(getpropertydataUrl, request, getauthtoken())
  }
  getmainatinancetablePostRequest(request) {
    return client.post(getmaintainancetableUrl, request, getauthtoken())
  }
  getpurchasedatapostrequest(request) {
    return client.get(getpurchasedataUrl + "/" + request, getauthtoken())
  }
  getexceldownloadrequest(request) {
    return client.get(getexceldownloadUrl + "/" + request, getauthtoken())
  }
  getdefaultvaluesrequest() {
    return client.get(getdefaultvalueUrl)
  }
  getsavedmaintainancetabledatarequest(request) {
    return client.post(getsavedmaintainancetableurl, request, getauthtoken())
  }
  getnewsletterPostRequest(request) {
    return client.post(getnewsletterUrl, request)
  }
  getadminsettingdataGetRequest(request) {
    return client.get(getadminsettingdataUrl)
  }
  getuserlogin(request) {
    return client.post(getuserloginUrl, request)
  }
  getresendotp(request) {
    return client.post(getresendotpUrl, request)
  }
  getuserregister(request) {
    return client.post(getuserregisterUrl, request)
  }
  gettosendotp(request) {
    return client.post(sendotpUrl, request)
  }
  gettoverifyotp(request) {
    return client.post(verifyotpUrl, request)
  }
  getfeaturednewsbloglistrequest() {
    return client.get(getfeaturednewsbloglistUrl)
  }
  getallnewsbloglistrequest() {
    return client.get(getallnewsbloglistUrl)
  }
  getallfaqlistrequest() {
    return client.get(getallfaqlistUrl)
  }
  getnewsblogdetailrequest(request) {
    return client.post(getnewsblogdetailUrl, request)
  }
  getfooterdatarequest() {
    return client.get(getappearancefooterdataUrl)
  }


  static async fetchData(url) {
    try {
      const response = await client.get(url, getauthtoken());
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async postData(url, data) {
    try {
      const response = await client.post(url, data, getauthtoken());
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async filterPostData(url, data) {
    try {
      const response = await client.post(url, data, getauthtoken());
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}