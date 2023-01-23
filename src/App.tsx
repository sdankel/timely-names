import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateTime } from 'luxon';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import TextField from '@mui/material/TextField';
import DateInput from './DateInput';
import ResultsTable from './ResultsTable';

function App() {
  const [date, setDate] = React.useState<DateTime>(DateTime.now());

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          backgroundColor: '#282c34',
          minHeight: '5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'calc(10px + 2vmin)',
          color: 'white',
          fontFamily: 'cursive',
        }}>
        Timely Names
      </div>
      <div style={{ margin: '2rem' }}>
        Enter a date to find names of historical figures significant to the
        date.
      </div>
      <DateInput date={date} setDate={setDate} />
      <ResultsTable date={date} />
      <div></div>
    </div>
  );
}

export default App;
