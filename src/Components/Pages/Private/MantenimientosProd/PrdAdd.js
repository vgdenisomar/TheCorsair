// ES6
// ES5 var React = require('react');
// var Component = React.Component;
import React, { Component } from 'react';
import Button from '../../../Common/Btns/Buttons';
import Campo from '../../../Common/Campo/Campo';
import { paxios } from '../../../../Utilities';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import './prd.css'
import axios from 'axios';
/*
  module.exports = class Login .....
*/
export default class PrdAdd extends Component{
  UPLOAD_ENDPOINT = 'http://localhost/TheCorsair/imagen.php';
  constructor(){
    super();
    //definición del estado inicial
    this.state = {
      tipo:1,
      ex:'http://localhost/thecorsair/images/',
      nomProd:'',
      precioProd:'',
      imagen:'',
      error:false,
      imagenProd:''
    };
    //Para el autobinding
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSaveBtnClick = this.onSaveBtnClick.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
    this.onChanged = this.onChanged.bind(this)
  }

  addNotification() {
    this.notificationDOMRef.current.addNotification({
      title: "Notificacion",
      message: "Producto Agregado!",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }

  onChangeHandler(e){
    const {name, value} = e.target;
    //validar
    this.setState({...this.state,[name]:value});
    console.log(this.state.imagenProd)
  }
  onChanged(e) {
    this.setState({file:e.target.files[0]})
}
  onSaveBtnClick(){
    if (!this.state.nomProd.length > 0) {
      alert('Llene todos los campos');
      return;
    }
    if (!this.state.precioProd.length > 0) {
      alert('Llene todos los campos');
      return;
    }
      this.uploadImage();
      this.addNotification();
          window.setTimeout(() => {
            this.props.history.push("/mantenimiento");
         }, 500)
  }

  uploadImage=async()=>{
    const formData = new FormData();
        
    formData.append('avatar',this.state.file)
    formData.append('nomProd',this.state.nomProd)
    formData.append('precioProd',this.state.precioProd)
    formData.append('tipo',this.state.tipo)

    console.log(this.state.file);
    return  await axios.post(this.UPLOAD_ENDPOINT, formData,{
        headers: {
            'content-type': 'multipart/form-data'
        },
    });

  }


  render(){
    return (
      <section>
          <h1>Agregar Producto</h1>
          <ReactNotification ref={this.notificationDOMRef} />
        <section className="main fix640 overr234 top1">
        <Campo
            caption="Nombre Producto"
            value={this.state.nomProd}
            name="nomProd"
            onChange={this.onChangeHandler}
          />
          <Campo
            caption="Precio"
            value={this.state.precioProd}
            name="precioProd"
            onChange={this.onChangeHandler}
          />
          <div className={"imgg"}>
          <label class="col-4 left" for="imagen">Imagen </label>
          <label class="col-4 left" method="POST" enctype="multipart/form-data"/>
          <input  onChange={this.onChanged} type="file" name="imagenProd" id="imagen"/>
          </div>
          
          <div className="cmb">
          <legend className="legendari">Tipo</legend>
          <select className="tipo2" name="tipo" value={this.state.tipo}
           onChange={this.onChangeHandler}>
            <option value="1">Calientes</option>
              <option value="2">FriaslFrozen</option>
              <option value="3">Extras</option>
              <option value="4">Turbulentas</option>
              <option value="5">Reposteria</option>
              <option value="6">Agua/Soda</option>
              <option value="7">Artesanias</option>
          </select>
          
          </div>
      
          {(this.state.error && true)?(<div className="error">{this.state.error}</div>):null}
          <section className="action">
              <Button
                caption="Crear Producto"
                onClick={this.onSaveBtnClick}
                customClass="primary"
              />
          </section>
        </section>
      </section>
    );
  }
}
