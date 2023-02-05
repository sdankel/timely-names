import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateTime } from 'luxon';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import TextField from '@mui/material/TextField';

interface DatePickerProps {
  date: DateTime;
  setDate: (value: DateTime) => void;
}

const DateInput = ({ setDate, date }: DatePickerProps) => {
  const today = DateTime.now();
  return (
    <div style={{ margin: '2rem' }}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DatePicker
          disableMaskedInput
          views={['year', 'month', 'day']}
          label='Date'
          minDate={today.minus({ years: 100 }).toISODate()}
          maxDate={today.plus({ years: 100 }).toISODate()}
          value={date}
          onChange={(newValue: string | null) => {
            newValue && setDate(newValue as unknown as DateTime);
          }}
          renderInput={(params: any) => {
            return <TextField {...params} helperText={null} />;
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DateInput;
