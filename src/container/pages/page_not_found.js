import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import Header from "../../component/header";
import Footer from "../../component/footer";
function PageNotFound() {
  const didMountRef = useRef(true);
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  useEffect(() => {
    if (didMountRef.current) {
      setSpinnerLoading(false)
    }
    didMountRef.current = false;
  }, []);

  return (
    <>
      <Header />
      <BrowserView>
        <section className="sec-gap-medium text-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-12" >
                <h1 className="mt-5">Oops, you found our 404 page</h1>
                <img src="/img/img1.gif" alt="404 Error" style={{ width: "500px" }} />
                <h5 className="mb-5">The page you requested does not exist. <a href="/">Click here</a> to continue .</h5>
              </div>
            </div>
          </div>
        </section>
      </BrowserView>

      <MobileView>
        <section className="sec-gap-medium text-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-12" >
                <h1 className="mt-5">Oops, you found our 404 page</h1>
                <img src="/img/img1.gif" alt="404 Error" style={{ width: "300px" }} />
                <h5 className="mb-5">The page you requested does not exist. <a href="/">Click here</a> to continue .</h5>
              </div>
            </div>
          </div>
        </section>
      </MobileView>
      <Footer />
    </>
  );
}
export default PageNotFound;