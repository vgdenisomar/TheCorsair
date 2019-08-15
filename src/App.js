import React , {Component} from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import { setJWT, setUnAuthHandler, getLocalStorage, setLocalStorage, removeLocalStorage } from './Utilities';
import PrivateRoute from './PrivateRoute';

import NavBar from './Components/Common/NavBar/NavBar';
import Home from './Components/Pages/Public/Home/Home';
import Login from './Components/Pages/Public/Login/Login';
import Sigin from './Components/Pages/Public/Signin/Sigin';
import { AnimatedSwitch } from 'react-router-transition';
import { pageTransitions as transition, mapGlideStyles as mapStyles } from './Transition';

import Dashboard from  './Components/Pages/Private/Dashboard/Dashboard';
import products from './Components/Pages/Private/products/products';
import donaciones from './Components/Pages/Private/donaciones/donaciones';
import perfil from './Components/Pages/Private/perfil/perfil';
import pedidos from './Components/Pages/Private/pedidos/pedidos';
import entregar from './Components/Pages/Private/pedidos/entregar';
import mantenimiento from './Components/Pages/Private/mantenimiento/mantenimiento';
import detailcar from './Components/Pages/Private/detailcar/detailcar';
import prdAdd from './Components/Pages/Private/MantenimientosProd/PrdAdd';
import prdUpdate from './Components/Pages/Private/MantenimientosProd/PrdUpdate';
import detallePedido from './Components/Pages/Private/pedidos/detallePedido';
import pagar from './Components/Pages/Private/pedidos/pagar';
import usuarios from './Components/Pages/Private/usuarios/usuarios';
import usuariosadd from './Components/Pages/Private/usuarios/usuariosadd';
import usuariosview from './Components/Pages/Private/usuarios/usuariosview';

class App extends Component {
  constructor(){
    super();
    // verificar los datos de local storage
    this.state =  {
      "auth":( JSON.parse(getLocalStorage('auth')) ||
      {
        logged: false,
        token: false,
        user: {}
      })
    };
    this.setAuth = this.setAuth.bind(this);
    this.setUnAuth = this.setUnAuth.bind(this);

    setJWT(this.state.auth.token);
    setUnAuthHandler(this.setUnAuth);
  } // constructor


  setUnAuth(error){
    this.setAuth(false,{});
  }

  setAuth(token, user){
    setJWT(token);
    let _auth = {
      logged: true,
      token: token,
      user: user
    };
    var ladmin;
    if(user.admin==2){
      ladmin=false
    }
    else{
      ladmin=true
    }
    console.log(ladmin);
    setLocalStorage('auth', JSON.stringify(_auth));
    setLocalStorage('admin', JSON.stringify(ladmin));
    this.setState({
      auth: _auth
    });
  }

  render(){
    console.log(this.state.auth);
    return (
      <Router>
        <section className="container">
          <AnimatedSwitch
            {... transition}
            mapStyles={mapStyles}
            className="switch-wrapper"
          >
                      <Route path="/" exact render={ (props)=>(<Login {...props} auth={this.state.auth} setAuth={this.setAuth} />) } />
          <Route path="/signin"  component={Sigin} />
          <PrivateRoute path="/main" auth={this.state.auth} component={Dashboard} />
          <PrivateRoute path="/productos" auth={this.state.auth} component={products} />
          <PrivateRoute path="/donaciones" auth={this.state.auth} component={donaciones} />
          <PrivateRoute path="/perfil" auth={this.state.auth}  component={perfil} />
          <PrivateRoute path="/pedidos" auth={this.state.auth}  component={pedidos} />
          <PrivateRoute path="/entregar" auth={this.state.auth}  component={entregar} />
          <PrivateRoute path="/mantenimiento" auth={this.state.auth}  component={mantenimiento} />
          <PrivateRoute path="/detailcar" auth={this.state.auth}  component={detailcar} />
          <PrivateRoute path="/prdadd" auth={this.state.auth}  component={prdAdd} />
          <PrivateRoute path="/prdUpdate/:id" auth={this.state.auth}  component={prdUpdate} />
          <PrivateRoute path="/detallePedido/:id" auth={this.state.auth}  component={detallePedido} />
          <PrivateRoute path="/pagar/:id" auth={this.state.auth}  component={pagar} />
          <PrivateRoute path="/usuarios/" auth={this.state.auth}  component={usuarios} />
          <PrivateRoute path="/usuariosadd/" auth={this.state.auth}  component={usuariosadd} />
          <PrivateRoute path="/usuariosview/:id" auth={this.state.auth}  component={usuariosview} />
            </AnimatedSwitch>
          <NavBar auth={this.state.auth} />
        </section>
      </Router>
    );
  }
}

export default App;
