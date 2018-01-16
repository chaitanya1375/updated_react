import React from 'react';
import PerformanceChart from './PerformanceChart';
import Ddos from './timeSeries';
import Nasdaq from './Nasdaq';
import BitEther from './bitcoinChart';
import PublicPreference from './PublicPreference';
import UserBehavior from './UserBehavior';
import Ether from './EtherChart';
import Ripple from './RippleChart'

const Charts = () => (
  <div className="content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <PerformanceChart />
        </div>
        <div className="col-md-6">
          <Nasdaq />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <PublicPreference />
          <Ddos/>
          <Ether/>
        </div>
        <div className="col-md-6">
          <UserBehavior />
          <BitEther/>
          <Ripple/>
        </div>
      </div>
    </div>
  </div>
);

export default Charts;