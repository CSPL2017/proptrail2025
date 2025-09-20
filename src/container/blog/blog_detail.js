
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ApiService } from "../../component/services/apiservices";
import { BrowserView, MobileView } from "react-device-detect";
import moment from "moment";
import constant from '../../component/services/constant';
import Header from "../../component/header";
import Footer from "../../component/footer";

const Blogdetail = () => {
    let apiServices = new ApiService();
    const { slug } = useParams()
    const [blogdetail, setblogdetail] = useState({})
    const [isloading, setisloading] = useState(true)

    const didMountRef = useRef(true);
    useEffect(() => {
        if (didMountRef.current) {
            getnewsblogslist()
        }
        didMountRef.current = false;
    }, []);

    const getnewsblogslist = () => {
        const dataString = {
            blog_slug: slug
        }
        apiServices.getnewsblogdetailrequest(dataString).then(res => {
            if (res?.data?.status == "success") {
                setblogdetail(res?.data?.newsblogs)
                setisloading(false);
            } else {
                setisloading(false)
            }
        }).catch((error) => {

            setisloading(false);
        })
    }

    return (<>

        <BrowserView>
            <Header></Header>
            <div className="subheader">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                                    <li class="breadcrumb-item"><a href="/news-blogs">News & Blogs</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">
                                        Blog Title Here
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

            </div>
            <section className="section-gap-large">
                <div className="container">
                    <div className="row">
                        {isloading ? <>

                            <div className="col-lg-8">
                                <div className="listbog-details">
                                    <div className="thumbnail"><Skeleton height={'500px'}></Skeleton></div>
                                    <div className="content">
                                        <h1><Skeleton height={'20px'} width={'500px'}></Skeleton></h1>
                                        <ul className="blog-meta mb-3">
                                            <Skeleton height={'20px'} width={'200px'}></Skeleton>
                                            <Skeleton height={'20px'} width={'200px'}></Skeleton>
                                        </ul>
                                        <div className="desc">
                                            <div>
                                                <Skeleton height={'20px'} ></Skeleton>
                                                <Skeleton height={'20px'} ></Skeleton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </> : <>

                            <div className="col-lg-8">
                                <div className="listbog-details">
                                    <div className="thumbnail"><img src={blogdetail.blog_img ? constant.Image_Base_Url + '/' + blogdetail.blog_img : constant.default_img} alt="17091107154515.webp" /></div>
                                    <div className="content">
                                        <h4>{blogdetail?.blog_title}</h4>
                                        <ul className="blog-meta mb-3">
                                            <li>< i className="ri-calendar-fill"></i> {moment(blogdetail.createdAt).format('DD-MM-YYYY')}</li>
                                            {blogdetail.blog_written_by ? <li>< i className="ri-user-fill"></i>{blogdetail.blog_written_by}</li> : null}
                                        </ul>
                                        <div className="desc">
                                            <div>
                                                <p dangerouslySetInnerHTML={{ __html: blogdetail.blog_desc }}></p>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
            </section>
            <Footer></Footer>

        </BrowserView>
        <MobileView>
            <section className="section-gap-large">
                <div className="container">
                    <div className="row">
                        {isloading ? <>
                            <div className="col-lg-8">
                                <div className="listbog-details">
                                    <div className="thumbnail"><Skeleton height={'500px'}></Skeleton></div>
                                    <div className="content">
                                        <h1><Skeleton height={'20px'} width={'500px'}></Skeleton></h1>
                                        <ul className="blog-meta mb-3">
                                            <Skeleton height={'20px'} width={'200px'}></Skeleton>
                                            <Skeleton height={'20px'} width={'200px'}></Skeleton>
                                        </ul>
                                        <div className="desc">
                                            <div>
                                                <Skeleton height={'20px'} ></Skeleton>
                                                <Skeleton height={'20px'} ></Skeleton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </> : <>
                            <div className="col-lg-8">
                                <div className="listbog-details">
                                    <div className="thumbnail"><img src={blogdetail.blog_img ? constant.Image_Base_Url + '/' + blogdetail.blog_img : constant.default_img} alt="17091107154515.webp" /></div>
                                    <div className="content">
                                        <h1>{blogdetail?.blog_title}</h1>
                                        <ul className="blog-meta mb-3">
                                            <li>< i className="ri-calendar-fill"></i> {moment(blogdetail.createdAt).format('DD-MM-YYYY')}</li>
                                            {blogdetail.blog_written_by ? <li>< i className="ri-user-fill"></i>{blogdetail.blog_written_by}</li> : null}
                                        </ul>
                                        <div className="desc">
                                            <div>
                                                <p dangerouslySetInnerHTML={{ __html: blogdetail.blog_desc }}></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
            </section>
        </MobileView>
    </>)
}

export default Blogdetail