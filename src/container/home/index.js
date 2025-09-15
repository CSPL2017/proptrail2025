import Footer from "../../component/footer"
import Header from "../../component/header"

const Home = () => {

    return (<>
        <Header />
        <section className="flat-slider home-2">
            <div className="container relative">
                <div className="row">
                    <div className="col-xl-10">
                        <div className="slider-content">
                            <div className="heading">
                                <h2 className="title wow fadeIn animationtext clip" data-wow-delay=".2s" data-wow-duration="2000ms">Find A Home That Fits
                                    <br />
                                    <span className="tf-text s1 cd-words-wrapper">
                                        <span className="item-text is-visible">Perfectly</span>
                                        <span className="item-text is-hidden">Dream Home</span>
                                    </span>
                                </h2>
                                <p className="subtitle body-1 wow fadeIn" data-wow-delay=".8s" data-wow-duration="2000ms">We are a real estate agency that will help you find the best residence you dream of.</p>
                            </div>
                            <div className="flat-tab flat-tab-form">
                                <ul className="nav-tab-form style-2" role="tablist">
                                    <li className="nav-tab-item" role="presentation">
                                        <a href="#forRent" className="nav-link-item active" data-bs-toggle="tab">For Rent</a>
                                    </li>
                                    <li className="nav-tab-item" role="presentation">
                                        <a href="#forSale" className="nav-link-item" data-bs-toggle="tab">For Sale</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade active show" role="tabpanel">
                                        <div className="form-sl">
                                            <div className="wd-find-select style-2 shadow-st no-left-round">
                                                <div className="inner-group">
                                                    <div className="form-group-1 search-form form-style">
                                                        <label>Keyword</label>
                                                        <input type="text" className="form-control" placeholder="Search Keyword." value="" name="s" title="Search for" required="" />
                                                    </div>
                                                    <div className="form-group-2 form-style">
                                                        <label>Location</label>
                                                        <div className="group-ip">
                                                            <input type="text" className="form-control" placeholder="Search Location" value="" name="s" title="Search for" required="" />
                                                            <a href="#" className="icon icon-location"></a>
                                                        </div>
                                                    </div>
                                                    <div className="form-group-3 form-style">
                                                        <label>Type</label>
                                                        <div className="group-select">
                                                            <div className="nice-select" tabindex="0"><span className="current">All</span>
                                                                <ul className="list">
                                                                    <li data-value className="option selected">All</li>
                                                                    <li data-value="villa" className="option">Villa</li>
                                                                    <li data-value="studio" className="option">Studio</li>
                                                                    <li data-value="office" className="option">Office</li>

                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group-4 box-filter">
                                                        <a className="filter-advanced pull-right">
                                                            <span className="icon icon-faders"></span>
                                                            <span className="text-advanced">Advanced</span>
                                                        </a>
                                                    </div>
                                                </div>
                                                <button type="submit" className="tf-btn primary" href="#">Search</button>
                                            </div>
                                            <div className="wd-search-form">
                                                <div className="grid-2 group-box group-price">
                                                    <div className="widget-price">
                                                        <div className="box-title-price">
                                                            <span className="title-price">Price Range</span>
                                                            <div className="caption-price">
                                                                <span>from</span>
                                                                <span id="slider-range-value1" className="fw-7"></span>
                                                                <span>to</span>
                                                                <span id="slider-range-value2" className="fw-7"></span>
                                                            </div>
                                                        </div>
                                                        <div id="slider-range"></div>
                                                        <div className="slider-labels">
                                                            <div>
                                                                <input type="hidden" name="min-value" value="" />
                                                                <input type="hidden" name="max-value" value="" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="widget-price">
                                                        <div className="box-title-price">
                                                            <span className="title-price">Size Range</span>
                                                            <div className="caption-price">
                                                                <span>from</span>
                                                                <span id="slider-range-value01" className="fw-7"></span>
                                                                <span>to</span>
                                                                <span id="slider-range-value02" className="fw-7"></span>
                                                            </div>
                                                        </div>
                                                        <div id="slider-range2"></div>
                                                        <div className="slider-labels">
                                                            <div>
                                                                <input type="hidden" name="min-value2" value="" />
                                                                <input type="hidden" name="max-value2" value="" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid-2 group-box">
                                                    <div className="group-select grid-2">
                                                        <div className="box-select">
                                                            <label className="title-select text-variant-1">Rooms</label>
                                                            <div className="nice-select" tabindex="0"><span className="current">2</span>
                                                                <ul className="list">
                                                                    <li data-value="1" className="option">1</li>
                                                                    <li data-value="2" className="option selected">2</li>
                                                                    <li data-value="3" className="option">3</li>
                                                                    <li data-value="4" className="option">4</li>
                                                                    <li data-value="5" className="option">5</li>
                                                                    <li data-value="6" className="option">6</li>
                                                                    <li data-value="7" className="option">7</li>
                                                                    <li data-value="8" className="option">8</li>
                                                                    <li data-value="9" className="option">9</li>
                                                                    <li data-value="10" className="option">10</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="box-select">
                                                            <label className="title-select text-variant-1">Bathrooms</label>
                                                            <div className="nice-select" tabindex="0"><span className="current">2</span>
                                                                <ul className="list">
                                                                    <li data-value="1" className="option">1</li>
                                                                    <li data-value="2" className="option selected">2</li>
                                                                    <li data-value="3" className="option">3</li>
                                                                    <li data-value="4" className="option">4</li>
                                                                    <li data-value="5" className="option">5</li>
                                                                    <li data-value="6" className="option">6</li>
                                                                    <li data-value="7" className="option">7</li>
                                                                    <li data-value="8" className="option">8</li>
                                                                    <li data-value="9" className="option">9</li>
                                                                    <li data-value="10" className="option">10</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="group-select grid-2">
                                                        <div className="box-select">
                                                            <label className="title-select text-variant-1">Bedrooms</label>
                                                            <div className="nice-select" tabindex="0"><span className="current">2</span>
                                                                <ul className="list">
                                                                    <li data-value="1" className="option">1</li>
                                                                    <li data-value="2" className="option selected">2</li>
                                                                    <li data-value="3" className="option">3</li>
                                                                    <li data-value="4" className="option">4</li>
                                                                    <li data-value="5" className="option">5</li>
                                                                    <li data-value="6" className="option">6</li>
                                                                    <li data-value="7" className="option">7</li>
                                                                    <li data-value="8" className="option">8</li>
                                                                    <li data-value="9" className="option">9</li>
                                                                    <li data-value="10" className="option">10</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="box-select">
                                                            <label className="title-select fw-5">Type</label>
                                                            <div className="nice-select" tabindex="0"><span className="current">2</span>
                                                                <ul className="list">
                                                                    <li data-value="1" className="option">1</li>
                                                                    <li data-value="2" className="option selected">2</li>
                                                                    <li data-value="3" className="option">3</li>
                                                                    <li data-value="4" className="option">4</li>
                                                                    <li data-value="5" className="option">5</li>
                                                                    <li data-value="6" className="option">6</li>
                                                                    <li data-value="7" className="option">7</li>
                                                                    <li data-value="8" className="option">8</li>
                                                                    <li data-value="9" className="option">9</li>
                                                                    <li data-value="10" className="option">10</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="group-checkbox">
                                                    <div className="text-1">Amenities:</div>
                                                    <div className="group-amenities mt-8 grid-6">
                                                        <div className="box-amenities">
                                                            <fieldset className="amenities-item">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb1" checked />
                                                                <label for="cb1" className="text-cb-amenities">Air Condition</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb2" />
                                                                <label for="cb2" className="text-cb-amenities">Cable TV</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb3" />
                                                                <label for="cb3" className="text-cb-amenities">Ceiling Height</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb4" />
                                                                <label for="cb4" className="text-cb-amenities">Fireplace</label>
                                                            </fieldset>
                                                        </div>
                                                        <div className="box-amenities">
                                                            <fieldset className="amenities-item">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb5" />
                                                                <label for="cb5" className="text-cb-amenities">Disabled Access</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb6" checked />
                                                                <label for="cb6" className="text-cb-amenities">Elevator</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb7" />
                                                                <label for="cb7" className="text-cb-amenities">Fence</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb8" />
                                                                <label for="cb8" className="text-cb-amenities">Garden</label>
                                                            </fieldset>
                                                        </div>
                                                        <div className="box-amenities">
                                                            <fieldset className="amenities-item">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb9" checked />
                                                                <label for="cb9" className="text-cb-amenities">Floor</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb10" />
                                                                <label for="cb10" className="text-cb-amenities">Furnishing</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb11" checked />
                                                                <label for="cb11" className="text-cb-amenities">Garage</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb12" />
                                                                <label for="cb12" className="text-cb-amenities">Pet Friendly</label>
                                                            </fieldset>
                                                        </div>
                                                        <div className="box-amenities">
                                                            <fieldset className="amenities-item">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb13" />
                                                                <label for="cb13" className="text-cb-amenities">Heating</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb14" />
                                                                <label for="cb14" className="text-cb-amenities">Intercom</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb15" />
                                                                <label for="cb15" className="text-cb-amenities">Parking</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb16" />
                                                                <label for="cb16" className="text-cb-amenities">WiFi</label>
                                                            </fieldset>
                                                        </div>
                                                        <div className="box-amenities">
                                                            <fieldset className="amenities-item">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb17" />
                                                                <label for="cb17" className="text-cb-amenities">Renovation</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb18" />
                                                                <label for="cb18" className="text-cb-amenities">Security</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb19" />
                                                                <label for="cb19" className="text-cb-amenities">Swimming Pool</label>
                                                            </fieldset>

                                                        </div>
                                                        <div className="box-amenities">
                                                            <fieldset className="amenities-item">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb20" />
                                                                <label for="cb20" className="text-cb-amenities">Window Type</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb21" />
                                                                <label for="cb21" className="text-cb-amenities">Search property</label>
                                                            </fieldset>
                                                            <fieldset className="amenities-item mt-12">
                                                                <input type="checkbox" className="tf-checkbox style-1" id="cb22" />
                                                                <label for="cb22" className="text-cb-amenities">Construction Year</label>
                                                            </fieldset>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="wrap-search-link">
                                <p className="body-1">What are you looking for:</p>
                                <a href="#" className="current body-1">Apartment,</a>
                                <a href="#" className="body-1">Villa,</a>
                                <a href="#" className="body-1">Studio,</a>
                                <a href="#" className="body-1">House</a>
                            </div>

                        </div>
                    </div>


                </div>

            </div>
            <div className="img-banner-left">
                <img src="images/slider/graplic-slider-2.png" alt="img" />
            </div>
            <div className="img-banner-right">
                <div className="swiper slider-sw-home2">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <div className="slider-home2 img-animation wow">
                                <img src="images/slider/slider-2.jpg" alt="images" />
                            </div>
                        </div>
                        <div className="swiper-slide">
                            <div className="slider-home2">
                                <img src="images/slider/slider-2-1.jpg" alt="images" />
                            </div>
                        </div>
                        <div className="swiper-slide">
                            <div className="slider-home2">
                                <img src="images/slider/slider-2-2.jpg" alt="images" />
                            </div>
                        </div>
                        <div className="swiper-slide">
                            <div className="slider-home2">
                                <img src="images/slider/slider-2-3.jpg" alt="images" />
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </section>
        <section className="flat-section">
            <div className="container">
                <div className="box-title style-1 wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
                    <div className="box-left">
                        <div className="text-subtitle text-primary">Our Services</div>
                        <h4 className="mt-4">What We Do?</h4>
                    </div>
                    <a href="#" className="btn-view"><span className="text">View All Services</span> <span className="icon icon-arrow-right2"></span> </a>
                </div>
                <div className="flat-service wrap-service wow fadeInUpSmall" data-wow-delay=".4s" data-wow-duration="2000ms">
                    <div className="box-service hover-btn-view">
                        <div className="icon-box">
                            <span className="icon icon-buy-home"></span>
                        </div>
                        <div className="content">
                            <h6 className="title">Buy A New Home</h6>
                            <p className="description">Discover your dream home effortlessly. Explore diverse properties and expert guidance for a seamless buying experience.</p>
                            <a href="#" className="btn-view style-1"><span className="text">Learn More</span> <span className="icon icon-arrow-right2"></span> </a>
                        </div>
                    </div>
                    <div className="box-service hover-btn-view">
                        <div className="icon-box">
                            <span className="icon icon-rent-home"></span>
                        </div>
                        <div className="content">
                            <h6 className="title">Rent a home</h6>
                            <p className="description">Discover your perfect rental effortlessly. Explore a diverse variety of listings tailored precisely to suit your unique lifestyle needs.</p>
                            <a href="#" className="btn-view style-1"><span className="text">Learn More</span> <span className="icon icon-arrow-right2"></span> </a>
                        </div>
                    </div>
                    <div className="box-service hover-btn-view">
                        <div className="icon-box">
                            <span className="icon icon-sale-home"></span>
                        </div>
                        <div className="content">
                            <h6 className="title">Sell a home</h6>
                            <p className="description">Sell confidently with expert guidance and effective strategies, showcasing your property's best features for a successful sale.</p>
                            <a href="#" className="btn-view style-1"><span className="text">Learn More</span> <span className="icon icon-arrow-right2"></span> </a>
                        </div>
                    </div>
                </div>
                <div className="flat-counter tf-counter wrap-counter wow fadeInUpSmall" data-wow-delay=".4s" data-wow-duration="2000ms">
                    <div className="counter-box">
                        <div className="count-number">
                            <div className="number" data-speed="2000" data-to="85" data-inviewport="yes">85</div>
                        </div>
                        <div className="title-count">Satisfied Clients</div>
                    </div>
                    <div className="counter-box">
                        <div className="count-number">
                            <div className="number" data-speed="2000" data-to="112" data-inviewport="yes">112</div>
                        </div>
                        <div className="title-count">Awards Received</div>
                    </div>
                    <div className="counter-box">
                        <div className="count-number">
                            <div className="number" data-speed="2000" data-to="32" data-inviewport="yes">32</div>
                        </div>
                        <div className="title-count">Successful Transactions</div>
                    </div>
                    <div className="counter-box">
                        <div className="count-number">
                            <div className="number" data-speed="2000" data-to="66" data-inviewport="yes">66</div>
                        </div>
                        <div className="title-count">Monthly Traffic</div>
                    </div>
                </div>
            </div>
        </section>
        <section className="flat-section-v3 flat-latest-new bg-surface">
            <div className="container">
                <div className="box-title text-center wow fadeIn" data-wow-delay=".2s" data-wow-duration="2000ms">
                    <div className="text-subtitle text-primary">Latest New</div>
                    <h4 className="mt-4">Helpful Homeya Guides</h4>
                </div>
                <div className="row">
                    <div className="box col-lg-4 col-md-6">
                        <a href="blog-detail.html" className="flat-blog-item hover-img wow fadeIn" data-wow-delay=".2s" data-wow-duration="2000ms">
                            <div className="img-style">
                                <img src="images/blog/blog-1.jpg" alt="img-blog" />
                                <span className="date-post">January 28, 2024</span>
                            </div>
                            <div className="content-box">
                                <div className="post-author">
                                    <span className="fw-6">Esther</span>
                                    <span>Furniture</span>
                                </div>
                                <h6 className="title">Building gains into housing stocks and how to trade the sector</h6>
                                <p className="description">The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...</p>
                            </div>
                        </a>
                    </div>
                    <div className="box col-lg-4 col-md-6">
                        <a href="blog-detail.html" className="flat-blog-item hover-img wow fadeIn" data-wow-delay=".4s" data-wow-duration="2000ms">
                            <div className="img-style">
                                <img src="images/blog/blog-2.jpg" alt="img-blog" />
                                <span className="date-post">January 31, 2024</span>
                            </div>
                            <div className="content-box">
                                <div className="post-author">
                                    <span className="fw-6">Angel</span>
                                    <span>Interior</span>
                                </div>
                                <h6 className="title">92% of millennial homebuyers say inflation has impacted their plans</h6>
                                <p className="description">Mortgage applications to purchase a home, however, dropped 4% last week compared...</p>
                            </div>
                        </a>
                    </div>
                    <div className="box col-lg-4 col-md-6">
                        <a href="blog-detail.html" className="flat-blog-item hover-img wow fadeIn" data-wow-delay=".6s" data-wow-duration="2000ms">
                            <div className="img-style">
                                <img src="images/blog/blog-3.jpg" alt="img-blog" />
                                <span className="date-post">January 28, 2024</span>
                            </div>
                            <div className="content-box">
                                <div className="post-author">
                                    <span className="fw-6">Colleen</span>
                                    <span>Architecture</span>
                                </div>
                                <h6 className="title">We are hiring ‘moderately,’ says Compass CEO</h6>
                                <p className="description">New listings were down 20% year over year in March, according to Realtor.com, and total inventory...</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </>)
}
export default Home