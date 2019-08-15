// ES6
// ES5 var React = require('react');
// var Component = React.Component;
import React, { Component } from 'react';
import Button from '../../../Common/Btns/Buttons';
import Campo from '../../../Common/Campo/Campo';
import { naxios } from '../../../../Utilities';
import logo from '../image/logoSustento.jpeg'
import '../Login/login.css'
/*
  module.exports = class Login .....
*/
export default class Signin extends Component{
  constructor(){
    super();
    //definición del estado inicial
    this.state = {
      name:'',
      email:'',
      password:'',
      error:false
    };
    //Para el autobinding
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSiginBtnClick = this.onSiginBtnClick.bind(this);
  }

  onChangeHandler(e){
    const {name, value} = e.target;
    //validar
    this.setState({...this.state,[name]:value});
  }
  onSiginBtnClick(e){
    const {name, email, password} = this.state;
    naxios.post('/api/security/signin', {name,email, password })
    .then(({data})=>{
      console.log(data);
      this.props.history.push("/");
    })
    .catch((error)=>{
      console.log(error);
      this.setState({error:"Error al crear cuenta. Intente nuevamente."})
    })
  }

  render(){
    return (
      <section>
        <h1>Crear Nueva Cuenta</h1>
        <img className='logo' src={logo}></img>
        <section className="main fix640">
        <Campo
            caption="Nombre"
            value={this.state.name}
            name="name"
            onChange={this.onChangeHandler}
          />
         <Campo
          caption="Correo Electrónico"
          value={this.state.email}
          name="email"
          onChange={this.onChangeHandler}
         />
          <Campo
            caption="Contraseña"
            type="password"
            value={this.state.password}
            name="password"
            onChange={this.onChangeHandler}
          />
          {(this.state.error && true)?(<div className="error">{this.state.error}</div>):null}
          <section className="action">
              <Button
                caption="Crear Cuenta"
                onClick={this.onSiginBtnClick}
                customClass="primary"
              />
              <Button
                caption="Iniciar Sesión"
                customClass="link"
                onClick={(e)=>{this.props.history.push('/')}}
              />
          </section>
        </section>
      </section>
    );
  }
}
