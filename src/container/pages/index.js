
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../component/services/apiservices";
import Header from "../../component/header";
import Footer from "../../component/footer";

function Pages() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const didMountRef = useRef(true)

  const [pageData, setPageData] = useState({});
  const [pageContent, setPageContent] = useState("");

  useEffect(() => {
    if (didMountRef.current) {
      const getpagesData = {
        slug: slug,
      };
      ApiService.postData('/getpagesdata',getpagesData).then(res => {
        if (res.status == 'success') {
          setPageData(res?.data)
          setPageContent(res?.data?.page_content);
        }
        else if(res.status==='error'&& res.message==="Page not found"){
          navigate('/error_404')
        }
      }).catch(()=>{})

    }
    didMountRef.current = false;
  }, [])

  return (
    <>
      <BrowserView>
        <Header />
        <section >
          {pageContent != null ? (
            <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
          ) : (
            ""
          )}
        </section>
        <Footer />
      </BrowserView>
      <MobileView>
        <div >
          {pageContent != null ? (
            <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
          ) : (
            ""
          )}
        </div>
      </MobileView>
    </>
  )
}

export default Pages