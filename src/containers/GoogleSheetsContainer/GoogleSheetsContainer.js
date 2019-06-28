import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as googleActions from 'store/modules/googleSheets';

class GoogleSheetsContainer extends Component {
  constructor(props) {
    super(props);
    const mapOfConference = {
      days: {
        monStart: 'D',
        tueStart: 'P',
        wendsStart: 'AB',
        thueStart: 'AC',
        thurStart: 'AN',
        firStart: 'AZ'
      }
    };
  }

  handleGetData = () => {
    const { GoogleActions } = this.props;
    GoogleActions.getConferenceList();
  }

  componentDidMount() {
    this.handleGetData();
  }

  render() {

    return (
      <div>
        컨테이터
      </div>
    );
  }
}

const mapStateToProps = ({ googleSheets }) => {
  console.log('googleSheets', googleSheets);
  return {
    data: []
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    GoogleActions: bindActionCreators(googleActions, dispatch),
  })
)(GoogleSheetsContainer);
