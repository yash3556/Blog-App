import React from 'react'
import {Container,Logo,Logoutbtn} from "../index";
import { useSelector } from 'react-redux';
import "./Header.css"; 
import { Link } from 'react-router-dom';

function Header() {
   const authstatus = useSelector((state) => state.auth?.status ?? false);

   const navItems = [
    {
      name:`Home`,
      slug:"/",
      action:true

    },
    {
      name:"Login",
      slug:"/login",
      action:!authstatus,
    },
    {
      name:"Signup",
      slug:"/signup",
      action:!authstatus,
    },
    {
      name:"All Posts",
      slug:"/all-post",
      action:authstatus,
    },
    {
      name:"Add Post",
      slug:"/add-post",
      action:authstatus,
    },
   ]
  return (
   <header>
      <Container>
           <nav>
            <div className="Headerlogo">
              <Logo fontSizeIcon={25} fontSize={20} width={10} height={10}/>
            </div>
              <ul style={{listStyleType:'none'}}>
                {navItems.map((item) =>
                 item.action ? (
                  <li key={item.name}>
                    <Link to={item.slug}>{item.name}</Link>
                  </li>
                 ) : null
              )}

              {authstatus && (
                <li>
                  <Logoutbtn/>
                </li>
              )}
            </ul>
           </nav>
      </Container>
   </header>
  )
}

export default Header
