import React from 'react';
import EmailChart from './EmailChart';
import SalesChart from './SalesChart';
import UserBehaviorChart from './UserBehaviorChart';
import TimeSeriesChart from '../Charts/timeSeries';
import Tasks from './Tasks';
import CurrencyStatistic from './currencyChart';

const Dashboard = () => (
  <div className="content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4">
          <EmailChart />
        </div>
        <div className="col-md-8">
          <CurrencyStatistic />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <UserBehaviorChart />
          <TimeSeriesChart/>
        </div>
        <div className="col-md-6">
          <Tasks />
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;