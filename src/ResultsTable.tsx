import React, { memo, useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import LaunchIcon from '@mui/icons-material/Launch';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import useWikipedia from './useWikipedia';
import useFirstNameGender, { Gender } from './useFirstNameGender';
import useGoogleSearch from './useGoogleSearch';

export interface Entry {
  id: number;
  firstName: string;
  gender: Gender;
  meaning?: string;
  fullName: string;
  year: number;
  significance: string;
  // nameMeaning: string;
  description: string;
  link: string;
}

const columns: GridColDef<Entry>[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  {
    field: 'firstName',
    headerName: 'First name',
    flex: 1,
  },
  {
    field: 'gender',
    headerName: 'Gender',
    flex: 1,
  },
  {
    field: 'meaning',
    headerName: 'Name meaning',
    flex: 2,
  },
  {
    field: 'fullName',
    headerName: 'Name',
    flex: 2,
  },
  {
    field: 'year',
    headerName: 'Year',
    flex: 1,
  },
  {
    field: 'significance',
    headerName: 'Significance',
    flex: 1,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 3,
  },
  {
    field: 'link',
    headerName: 'Link',
    flex: 1,
    renderCell: (params) => {
      return <a href={params.row.link} target="_blank" rel="noreferrer"><LaunchIcon fontSize='small' /></a>;
    },
  },
];

interface ResultsTableProps {
  date: DateTime;
}

const ResultsTable = ({ date }: ResultsTableProps) => {
  const { data, loading, error } = useWikipedia(date);
  const firstNames = data.map((entry) => entry.firstName);

  const genderResult = useFirstNameGender(firstNames);
  const meaningResult = useGoogleSearch(firstNames.slice(0, 10)); // todo

  console.log(`meaningResult: `, meaningResult);

  const rows: Entry[] | undefined = useMemo(() => {
    if (!loading && !!genderResult) {
      return data
        .filter((d) => !!genderResult[d.firstName])
        .map((d, idx) => {
          return {
            ...d,
            id: idx + 1,
            gender: genderResult[d.firstName][0]!,
            meaning: meaningResult ? meaningResult[d.firstName] : undefined,          
          };
        });
    }
  }, [data, genderResult, meaningResult, loading]);

  if (error) {
    <div style={{ marginBottom: '2rem' }}>
      An error occurred, please try again later.
    </div>;
  }

  if (!rows) {
    return <CircularProgress />;
  }

  if (!rows.length) {
    return (
      <div style={{ marginBottom: '2rem' }}>
        No results, try removing filters.
      </div>
    );
  }

  return (
    <div style={{ margin: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        {'Results for '}
        <b>
          {date.monthLong} {date.day}
        </b>
      </div>

      <Box sx={{ height: '500px', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Box>
    </div>
  );
};

export default memo(ResultsTable);
