import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  MainPage,
  WebRTCPage,
  GoogleSheetsPage,
  NotFoundPage
} from 'pages';

import { GoogleSheetsContainer } from 'containers';

const App = () => {
  return (
    <div>
      <div className="wrap-contents">
        <Switch>
          <Route exact path='/' component={MainPage} />
          <Route exact path='/webRTC' component={WebRTCPage} />
          <Route exact path='/googleSheets' component={GoogleSheetsPage} />
          <Route component={NotFoundPage} />
        </Switch>
        <GoogleSheetsContainer />
      </div>
    </div>
  );
};

export default App;
