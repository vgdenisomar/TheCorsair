import React, { Component } from 'react';
import './products.css'
import { Link } from 'react-router-dom';
import { IoIosAdd, IoIosExit, IoMdAddCircle } from 'react-icons/io';
import { paxios } from '../../../../Utilities';
import { MdDelete } from "react-icons/md";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import logo from '../../../../images/logo1.png'
import ReactToPrint from 'react-to-print';


/*
  module.exports = class Login .....
*/
export default class Login extends Component {

  constructor() {
    super();
    this.state = {
      tipo: 1,
      error3: false,
      total: 0,
      subtotal: 0,
      isv: 0,
      things: [],
      things2: [],
      hasMore: true,
      page: 1,
      intervalIsSet: false,
      itemsToLoad: 10
    }
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
  }
  componentDidMount() {
    this.getDataFromDb();
    this.getDataFromDb2();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 500);
      this.setState({ intervalIsSet: interval });
    }
  }

  onChangeHandler(e) {
    const { name, value } = e.target;
    //validar
    this.setState({ ...this.state, [name]: value });
    console.log(this.state.tipo)
  }

  printDocument = () => {
    this.setState({ error3: true });
    window.setTimeout(() => {
      this.printDocument2();
    }, 1)

  }
  printDocument2 = () => {
    fetch('http://localhost/TheCorsair/email.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson === 'Data Matched') {
          this.addNotification3();
          window.setTimeout(() => {
            window.location.href = '/productos';
          }, 2000)

        }
        else {
          alert(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }

  addNotification3() {
    this.notificationDOMRef.current.addNotification({
      title: "Notificacion",
      message: "Realizado!",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
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

  addNotification2() {
    this.notificationDOMRef.current.addNotification({
      title: "Notificacion",
      message: "Producto Eliminado!",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }


  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }


  delete = (codProd) => {
    fetch('http://localhost/TheCorsair/deleteCar.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        // we will pass our input data to server
        codProd: codProd,
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson === 'Data Matched') {
          this.getDataFromDb2();

        }
        else {
          alert(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getDataFromDb2 = () => {
    {
      fetch('http://localhost/TheCorsair/obtenerCar.php', {
        method: 'post',
        header: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          // we will pass our input data to server
          codCliente: localStorage.getItem("id")
        })

      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState(
            {
              things2: responseJson,
              loading: false
            },

          )
          const { things2 } = this.state;
          var a = 0, b = 0, c = 0, d = 0, bb = 0, aa=0;
          things2.map((dat) => {
            dat.precio=parseFloat(dat.precioProd)-parseFloat(dat.precioProd*0.15);
            b = parseFloat(dat.precio) * parseFloat(dat.cant);
            bb = parseFloat(dat.precioProd) * parseFloat(dat.cant);
            a += (b);
            aa += (bb);
            c = parseFloat(aa * 0.15).toFixed(2);
            d += parseFloat(dat.precioProd*dat.cant);
            this.setState({
              subtotal: a,
              isv: c,
              total: d
            })
          })
        })
        .catch((error) => {
          this.setState({ error, loading: false })
          console.log(error);
        })
    }
  };


  getDataFromDb = () => {
    {
      const url = "http://localhost/TheCorsair/products.php";
      fetch(url, {
        method: 'post',
        header: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          tipo: this.state.tipo
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            things: responseJson,
            loading: false
          },
            function () {
              this.arrayholder = responseJson;
            }
          )
        })
        .catch((error) => {
          this.setState({ error, loading: false })
          console.log(error);
        });
    }
  };
  logout(e) {
    localStorage.clear();
    window.location.href = '/';
  }

  cancelar = () => {
    fetch('http://localhost/TheCorsair/cancelarFac.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        // we will pass our input data to server
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson === 'Data Matched') {
          window.location.href = '/productos';
        }
        else {
          alert(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  cancelar1 = () => {
    fetch('http://localhost/TheCorsair/email.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
      })
      .catch((error) => {
        console.error(error);
      });
    fetch('http://localhost/TheCorsair/cancelarFac.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        // we will pass our input data to server
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson === 'Data Matched') {
          window.location.href = '/productos';
        }
        else {
          alert(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }


  register = (codProd) => {

    fetch('http://localhost/TheCorsair/registerCar.php', {
      method: 'post',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        // we will pass our input data to server
        codProd: codProd,
      })

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson === 'Data Matched') {
          this.getDataFromDb2();

        }
        else {
          alert(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { things, things2 } = this.state;
    return (
      <section>
        <h1 className="back">Facturacion
        <Link>
            <IoIosExit className="log" onClick={this.logout} size="1.2em" />
          </Link>

        </h1>
        <section className="mainn">
          <section className="overr421">
            <legend className="legendario">Tipo</legend>
            <select className="tipo2" name="tipo" value={this.state.tipo}
              onChange={this.onChangeHandler}>
              <option value="1">Calientes</option>
              <option value="2">FriaslFrozen</option>
              <option value="3">Extras</option>
              <option value="4">Turbulentas</option>
              <option value="5">Reposteria</option>
            </select>
            <section className="overr42">
              {things.length <= 0
                ? 'Cargando'
                : things.map((dat) => (
                  <div className="thingItem" key={dat._id}>
                    <img className="imagen" src={dat.imagen}></img>
                    <div className="thingItem2" key={dat._id}>
                      <ReactNotification ref={this.notificationDOMRef} />
                      <div className="nombre">
                        <span className="nombre2"> {dat.nomProd}</span>
                        <IoIosAdd className="iconoadd2" onClick={this.register.bind(this, dat.codProd)} size="2em" />
                      </div>

                    </div>
                  </div>
                ))}
            </section>

          </section>
          <section className="overr2">
            <div className="thingItem_man2">
              <div className="spandetail22">
                <span className=""> Nombre</span>
              </div>
              <span>Cantidad</span>
              <span>Precio</span>
              <span></span>
            </div>
            {things2.length <= 0
              ? 'Seleccione un producto para realizar su compra'
              : things2.map((dat) => (
                <div className="thingItem_man" key={dat._id}>
                  <div className="spandetail">
                    <span className=""> {dat.nomProd}</span>
                  </div>
                  <div className="spandetail2">
                    <span className=""> {dat.cant}</span>
                  </div>
                  <div className="spandetail3">
                    <span className=""> {dat.precio}</span>
                  </div>
                  <MdDelete onClick={this.delete.bind(this, dat.codProd)} size="2em" />
                </div>
              ))}
            <div className="thingItem_man2">
              <span> Sub Total:</span>
              <span> {this.state.subtotal} </span>
            </div>

            <div className="thingItem_man2">
              <span> ISV (15%):</span>
              <span> {this.state.isv} </span>
            </div>

            <div className="thingItem_man3">
              <span>Total a Pagar:</span>
              <span> {this.state.total} </span>
            </div>
            <div className="imprimir">
              <button onClick={this.cancelar} className="imprimir3">Cancelar</button>
              <ReactToPrint
                trigger={() => <a href="#"><button className="imprimir2">Imprimir</button></a>}
                content={() => this.componentRef}
                onAfterPrint={() => this.cancelar1()}
              />
            </div>
            <ComponentToPrint ref={el => (this.componentRef = el)} />
          </section>
        </section>
      </section>
    );
  }
}

class ComponentToPrint extends React.Component {

  constructor() {
    super();
    this.state = {
      fecha:0,
      tipo: 1,
      error3: false,
      total: 0,
      subtotal: 0,
      isv: 0,
      things: [],
      things2: [],
      hasMore: true,
      page: 1,
      intervalIsSet: false,
      itemsToLoad: 10
    }
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  componentDidMount() {
    this.getDataFromDb2();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb2, 500);
      this.setState({ intervalIsSet: interval });
    }
  }

  onChangeHandler(e) {
    const { name, value } = e.target;
    //validar
    this.setState({ ...this.state, [name]: value });
    console.log(this.state.tipo)
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb2 = () => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    this.setState({
      //Setting the value of the date time
      date:
        date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec,
    });
    {
      fetch('http://localhost/TheCorsair/obtenerCar.php', {
        method: 'post',
        header: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          // we will pass our input data to server
          codCliente: localStorage.getItem("id")
        })

      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState(
            {
              things2: responseJson,
              loading: false
            },

          )
          const { things2 } = this.state;
          var a = 0, b = 0, c = 0, d = 0, bb = 0, aa=0;
          things2.map((dat) => {
            dat.precio=parseFloat(dat.precioProd)-parseFloat(dat.precioProd*0.15);
            b = parseFloat(dat.precio) * parseFloat(dat.cant);
            bb = parseFloat(dat.precioProd) * parseFloat(dat.cant);
            a += (b);
            aa += (bb);
            c = parseFloat(aa * 0.15).toFixed(2);
            d += parseFloat(dat.precioProd*dat.cant);
            this.setState({
              subtotal: a,
              isv: c,
              total: d
            })
            return dat;
          })
        })
        .catch((error) => {
          this.setState({ error, loading: false })
          console.log(error);
        })
    }
  };


  render() {
    const { things, things2 } = this.state;
    return (
      <div id="divToPrint" className="mt4" style={{
        width: '20mm',
        minHeight: '297mm',
      }}>
        <section className="overr2777">
          <div>
            <img className='logo777' src={logo}></img>
            <div className="texto777">
              <span>Frente a Banasupro, Calle principal de los negocios.
    </span>
              <span>Valle De Angeles, Francisco Morazan, Honduras</span>
              <span>Tel: 8988-7614</span>
              <span>Fecha: {this.state.date}</span>
            </div>
          </div>
          <div className="thingItem_man2777">
            <div className="spandetail22777">
              <span className=""> Nombre</span>
            </div>
            <span>Cant</span>
            <span style={{ marginLeft: 12 }}>Precio</span>
            <span></span>
          </div>
          {things2.length <= 0
            ? ('Seleccione un producto para realizar su compra')
            : things2.map((dat) => (
              <div className="thingItem_man777" key={dat._id}>
                <div className="spandetail777">
                  <span className=""> {dat.nomProd}</span>
                </div>
                <span className=""> {dat.cant}</span>
                <span className=""> {dat.precio}</span>
              </div>
            ))}
          <div className="thingItem_man2777">
            <span> Sub Total:</span>
            <span> {this.state.subtotal} </span>
          </div>

          <div className="thingItem_man2777">
            <span> ISV (15%):</span>
            <span> {this.state.isv} </span>
          </div>

          <div className="thingItem_man3777">
            <span>Total a Pagar:</span>
            <span> {this.state.total} </span>
          </div>

        </section>
      </div>
    );
  }
}