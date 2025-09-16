import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DataProvider } from './component/elements/context';
import { GoogleOAuthProvider } from "@react-oauth/google";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DataProvider>
      <GoogleOAuthProvider clientId="805043508422-d699h998k9ltql8dd8h5qk97fekp1lsk.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </DataProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
