import React, { Component } from 'react';
import '../products/products1.css'
import { Link } from 'react-router-dom';
import { IoIosAdd, IoIosCart, IoIosSync, IoMdAddCircle, IoIosInformationCircleOutline} from 'react-icons/io';
import { paxios } from '../../../../Utilities';
/*
  module.exports = class Login .....
*/
export default class Login extends Component {

  constructor() {
    super();
    this.state = {
      things: [],
      hasMore: true,
      page: 1,
      intervalIsSet: false,
      itemsToLoad: 10
    }
  }
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 2000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }
  getDataFromDb = () => {
    {
      const url = "http://localhost/TheCorsair/usuarios.php";
      fetch(url, {
        method: 'post',
        header: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          lon: -87.2608289,
          lat: 14.0522674,
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

  register = (codProd, nombre_Product) => {
    paxios.post('/api/car', { codProd, nombre_Product })
      .then(({ data }) => {
        console.log("agregado");
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Error al crear nuevo Thing" });
      })
  }

  render() {
    const { things } = this.state;
    return (
      <section>
        <h1>The Corsair
            <Link to="usuariosadd">
            <IoIosAdd className="agg" size="1.2em" />
          </Link>
        </h1>
        <section className="overr234">
          {things.length <= 0
            ? 'Cargando'
            : things.map((dat) => (
              <div className="thingItem_man" key={dat.codProd}>
              <span> {dat.nameUser}</span>
              <span className="updateThing">
                <Link to={`/usuariosview/${dat.codUser}`}>
                  <IoIosInformationCircleOutline size="2em"/>
                </Link>
              </span>
            </div>

            ))}
        </section>

      </section>
    );
  }
}
