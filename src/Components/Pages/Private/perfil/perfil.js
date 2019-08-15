import React, { Component } from 'react';
import { IoIosLogOut } from 'react-icons/io';
import Button from '../../../Common/Btns/Buttons';
import { paxios } from '../../../../Utilities';
/*
  module.exports = class Login .....
*/
export default class Login extends Component{

  
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
    logout(e){
        localStorage.clear();
        window.location.href = '/';
    }

    render(){
        return (
          <section>
            <h1>Sustento</h1>
            {(this.props.auth.logged) ? (<div className="half"><Button customClass="primary" onClick={this.logout}><IoIosLogOut/>&nbsp;Logout</Button></div>):null}
          </section>
        );
}
}