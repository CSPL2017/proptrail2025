import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../component/services/apiservices";
import constant from "../../component/services/constant";
import Skeleton from "react-loading-skeleton";
import { BrowserView, MobileView } from "react-device-detect";
import Header from "../../component/header";
import Footer from "../../component/footer";
const BlogList = () => {
    let apiServices = new ApiService();
    const didMountRef = useRef(true);
    const [blogdata, setblogdata] = useState([])
    const [blogimgpath, setblogimgpath] = useState('')
    const [loading, setloading] = useState(false)
    useEffect(() => {
        if (didMountRef.current) {
            getnewsblogslist()
        }
        didMountRef.current = false;
    }, [])


    const skeletonArray = Array.from({ length: 3 });
    const navigate = useNavigate()

    const getnewsblogslist = () => {
        setloading(true);
        apiServices.getallnewsbloglistrequest().then(res => {
            if (res?.data?.status == "success") {
                setblogdata(res?.data?.newsblogs)
                setTimeout(() => {
                    setloading(false);
                }, 500)

            } else {
                setloading(false)
            }
        }).catch((error) => {

            setloading(false);
        })
    }
    return (<>


        <BrowserView>
            <Header />
            <div className="subheader">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <h1>News & Blog</h1>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">News & Blog</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>


            {loading ? <>
                <section className="section-gap-small">
                    <div className="container">
                        <div className="col-lg-8">
                            {skeletonArray.map((_, index) => {
                                return (<>
                                    <div className="bloglist" key={index}>
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <figure className="bloglistMedia">
                                                    <a href=''>
                                                        <Skeleton height={'200px'}></Skeleton>
                                                    </a>
                                                </figure>
                                            </div>
                                            <div className="col-lg-8">
                                                <h2 className="title"><a href=''> <Skeleton></Skeleton></a></h2>
                                                <div className="shortdesc"> <Skeleton width={'400px'}></Skeleton>
                                                    <Skeleton width={'400px'}></Skeleton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>)
                            })}

                        </div>
                    </div>
                </section>

            </> : <>
                {blogdata && blogdata.length > 0 ? <>
                    <section className="section-gap-small">
                        <div className="container">
                            <div className="col-lg-8">
                                {blogdata.map((item, index) => {
                                    return (<>
                                        <div className="bloglist" key={index} onClick={() => { navigate(`/blog-detail/${item.blog_slug}`) }}>
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <figure className="bloglistMedia">
                                                        <a href='javascript:void(0)'>
                                                            <img src={item.blog_img ? constant.Image_Base_Url + '/' + item.blog_img : constant.default_img} alt={item?.blog_title}></img>
                                                        </a>
                                                    </figure>
                                                </div>
                                                <div className="col-lg-8">
                                                    <div className="bloglistContent">
                                                        <h6 className="title"><a href='javascript:void(0)'>{item?.blog_title}</a></h6>
                                                        <div className="shortdesc">{item.blog_short_desc}</div>
                                                        <a href='javascript:void(0)' className="mt-20 btn-line small" style={{ display: 'inline-block' }}><span>Read More</span></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>)
                                })}

                            </div>
                        </div>
                    </section>
                </> : <div className='noimg'>
                    <h6>No blogs are there right now</h6>
                </div>}
            </>}
        </BrowserView>
        <MobileView>
            {/* <MobileInnerheader headertitle={'News & Blog'} gobackroute={'/'}></MobileInnerheader> */}
            <main>
                <div className="acpanel">
                    <div className="acpanel-body">
                        {loading ? <div className="col-lg-8">
                            {skeletonArray.map((_, index) => {
                                return (<>
                                    <div className="bloglist" key={index}>
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <figure className="bloglistMedia">
                                                    <a href=''>
                                                        <Skeleton height={'200px'}></Skeleton>
                                                    </a>
                                                </figure>
                                            </div>
                                            <div className="col-lg-8">
                                                <h2 className="title"><a href=''> <Skeleton></Skeleton></a></h2>
                                                <div className="shortdesc"> <Skeleton width={'400px'}></Skeleton>
                                                    <Skeleton width={'400px'}></Skeleton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>)
                            })}

                        </div> : <>
                            {blogdata && blogdata.length > 0 ? <>
                                <div className="col-lg-8">
                                    {blogdata.map((item, index) => {
                                        return (<>
                                            <div className="bloglist" key={index} onClick={() => { navigate(`/blog-detail/${item.blog_slug}`) }}>
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <figure className="bloglistMedia">
                                                            <a href='javascript:void(0)'>
                                                                <img src={item.blog_image ? blogimgpath + '/' + item.blog_image : constant.DEFAULT_IMAGE} alt={item?.blog_name}></img>
                                                            </a>
                                                        </figure>
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <div className="bloglistContent">
                                                            <h2 className="title"><a href='javascript:void(0)'>{item?.blog_name}</a></h2>
                                                            <div className="shortdesc">{item.blog_short_description}</div>
                                                            <a href='javascript:void(0)' className="mt-20 btn-line small" style={{ display: 'inline-block' }}><span>Read More</span></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>)
                                    })}

                                </div>
                            </> : <>
                                <div className='noimg'>
                                    <h6>No blogs are there right now</h6>
                                </div>
                            </>}
                        </>}
                    </div>
                </div>
            </main>
        </MobileView>
        <Footer></Footer>
    </>)
}
export default BlogList