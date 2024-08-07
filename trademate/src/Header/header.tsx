import React, { useRef, useState } from 'react';
import logo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link } from 'react-router-dom';

import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearUser } from '../userSlice';
import './header.css'
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn,setIsLoggedIn]=useState(false);

  const user = useSelector((state: RootState) => state.user.userInfo);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };
  const handleLogout = () => {
    dispatch(clearUser());
    // setIsLoggedIn(false); // Optional: Set the login state to false if you are using this state
  };
    return (

    
      <div className="Header text-danger col-lg-12">
      <nav className="navbar navbar-expand-lg bg-body-tertiary border border-solid border-black border-top border-left">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src="https://tse3.mm.bing.net/th?id=OIP.ggEWXv9b2N4NOvtLHB-p0gAAAA&pid=Api&P=0&h=180" alt="Bootstrap" width="300" height="60" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
              <li className="nav-item">
                <a className="nav-link active text-success" aria-current="page" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-success" href="#">Trade</a>
              </li>
              {/* <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={dropdownRef}>
                <a className="nav-link dropdown-toggle text-success" href="#" role="button" aria-expanded={isOpen}>
                  Dropdown
                </a>
              </li> */}
            
            </ul>
            {!user && <div className="d-flex">
              <button className="btn btn-outline-success me-2"><Link to='/login' style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link></button>
              <button className="btn btn-success me-2"><Link to='/register' style={{ textDecoration: 'none', color: 'inherit' }}>Sign Up</Link></button>
            </div> }
           

              <div className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={dropdownRef}>
                {user && <div className="d-flex">
                  <img src="https://tse2.mm.bing.net/th?id=OIP.6UhgwprABi3-dz8Qs85FvwHaHa&pid=Api&P=0&h=180" alt="Profile" className="rounded-circle me-2" style={{ width: '26px', height: '26px' }} />
                  <span className="nav-link dropdown-toggle text-success" role="button" aria-expanded={isOpen}>{user.email}</span>
                  {/* <a  href="#" >
                  </a> */}
                  <ul className={`dropdown-menu custom-dropdown${isOpen ? ' show' : ''}`} aria-labelledby="navbarDropdown">
                      <li><a className="dropdown-item text-success" href="/history">History</a></li>
                      {/* <li><a className="dropdown-item" href="#">...</a></li> */}
                      <li><hr className="dropdown-divider" /></li>
                      <li><span className="dropdown-item"  onClick={handleLogout} style={{ cursor:'pointer' }}>Logout</span></li>
                  </ul>
                </div>}
              </div>
          

          </div>
        </div>
      </nav>
    </div>
    );
}


  export default Header;