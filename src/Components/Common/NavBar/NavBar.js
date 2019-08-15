import React from 'react';
import { NavLink } from 'react-router-dom';
// https://react-icons.netlify.com/
import { IoIosLogIn, IoIosHome, IoIosKey, IoIosToday, IoIosList, IoIosDoneAll, IoIosPerson } from 'react-icons/io';
import './NavBar.css';

const NavItem = ({ to, children, ...rest }) => {
  return (
    <NavLink activeClassName="activeNav" className="iconotamaño" to={to}>{children}</NavLink>
  );
};

export default ({auth, unSetAuth})=>{
  console.log(auth);
  if(!auth.logged) {
    return (
      false
    )
  }
  else if(auth.user.admin==1){
    return(
      <nav>
      <NavItem to="/mantenimiento" activeClassName="active"><IoIosDoneAll />Productos</NavItem>
      <NavItem to="/usuarios"  activeClassName="active"><IoIosList/>Usuarios</NavItem>
      <NavItem to="/perfil"  activeClassName="active"><IoIosList/>Log Out</NavItem>

    </nav>
    )
  }
  else{
    return(
      <nav>
    </nav>
    )
  }
}
