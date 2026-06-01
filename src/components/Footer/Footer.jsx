import React from 'react'
import Logo from '../Logo/Logo';
import {FaGithub,FaInstagram,FaLinkedin,FaTwitter, FaPaperPlane} from "react-icons/fa";
import {Link} from 'react-router-dom';
import Button from '../Button/Button';
import './Footer.css'
function Footer() {
  const arr = ["/","Blogs","Categories","About Us","Contact"];
  return (
    <div className='footerCard'>
           <div className="main">

              <div className="BlogPart">
                  <div className="logo">
                    <span><Logo/></span>
                     </div>
                    <div className="BlogParttext">
                    <p><span>A space to share your thoughts,</span>
                      <span>inspire other, and explore </span>
                     <span> ideas that matters</span>
                    </p>
                    </div>
                    <div className="icons">
                      <FaGithub  />
                      <FaInstagram />
                      <FaLinkedin />
                      <FaTwitter />
                  
                    </div>
                 
              </div>


            <div className="Bloglink">
              <div className="quickLinks">
                <div className="quickLogo">
                  <h3>Quick Links</h3>
                </div>
                <div className="quicklinks">
                  {arr.map((item,index) => (
                     <Link 
                      key={index}
                      to={item === "/" ? "/" : `${item.replace(" ","-")}`}>
                        {item === "/" ? "> Home" : `> ${item}`}
                    </Link> 
                  ))}
                </div>
              </div>
              <div className="catagories">
                <div className="catagoriesLogo">
                  <h3>Categories</h3>
                </div>
                <div className="catagoriesLi">
                  <p>&gt; Technology</p>
                  <p>&gt; AI & ML</p>
                  <p>&gt; DesignL</p>
                  <p>&gt; Lifestyle</p>
                  <p>&gt; Programming</p>
                </div>
              </div>
              <div className="resources">
                <div className="resourcesLogo">
                  <h3>Resources</h3>
                </div>
                <div className="resourcesLi">
                  <p>&gt; Write for us</p>
                  <p>&gt; Guidelines</p>
                  <p>&gt; Privacy Policy</p>
                  <p>&gt; Terms & Condition</p>
                  <p>&gt; FAQ</p>
                </div>
              </div>
              <div className="newsletter">
                <div className="newsletterLogog">
                  <h3>News Letter</h3>
                </div>
                <div className="newsletterLi">
                  <div className="newsletterText">
                    <p>Subscribe to our news letter and get the latest blog updates straight to you inbox</p>
                  </div>
                  <div className="newsletterInput">
                    <input
                      type='email'
                      name='email'
                      placeholder='Enter your email'
                    />
                    <button type='submit'><FaPaperPlane size={20} /></button>
                  </div>
                </div>

              </div>
            </div>
            
           </div>
           <hr style={{borderColor: "gray",margin: "10px 0px 10px 190px",width:"70%",height:"1px"}}/>
           <p style={{textAlign:"center"}}>&copy; 2026 BlogApp. All rights reserved.</p>
         
    </div>
  )
}

export default Footer;
