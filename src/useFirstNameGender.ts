import { useEffect, useMemo, useState } from 'react';
import { Entry } from './ResultsTable';
import { DateTime } from 'luxon';
import Papa from 'papaparse';
import csv from 'csvtojson';
// import fs from 'fs';

interface SingleGenderRequest {
  id: string;
  first_name: string;
  country?: string;
}
type GenderRequest = SingleGenderRequest[];
interface SingleGenderResponse {
  input: {
    first_name: string;
    country: string;
    id: string;
  };
  details: {
    credits_used: number;
    duration: string;
    samples: number;
    country: string;
    first_name_sanitized: string;
  };
  result_found: boolean;
  first_name: string;
  probability: number;
  gender: Gender;
}
type GenderResponse = SingleGenderResponse[];
export type Gender = 'F' | 'M' | 'U';

const useFirstNameGender = (names: string[]) => {
  const csvFilePath = `${process.env.PUBLIC_URL}/name_gender_dataset.csv`;
  // const result: Record<string, Gender> = {};
  const [rawData, setRawData] = useState('');
  const [data, setData] = useState<Record<string, [Gender, number]> | null>(
    null
  );

  useEffect(() => {
    fetch(csvFilePath)
      .then((response) => response.text())
      .then((responseText) => {
        setRawData(responseText);
        // console.log(responseText);
        // csv({
        //   output: 'csv',
        // })
        //   .fromString(responseText)
        //   .then((csvRow) => {
        //     // 'James', 'M', '5304407', '0.014516787'
        //     const [name, gender, ...rest] = csvRow;
        //     const newData = { ...data, [name]: gender };
        //     console.log(`newData`, newData);
        //     setData(newData);
        //     // console.log(csvRow); // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]
        //   });
      });

    const newData: Record<string, [Gender, number]> = {};

    rawData
      .split('\n')
      .slice(1)
      .map((row) => {
        const [name, gender, _count, probability] = row.split(',');
        // If the probability of the larger one divided by the smaller one is greater than 10,
        // then we can use the larger one.
        if (!!newData[name]) {
          const [_oldGender, oldProbability] = newData[name];
          if (
            Number(probability) > oldProbability &&
            Number(probability) / oldProbability > 10
          ) {
            newData[name] = [gender as Gender, Number(probability)];
          } else if (
            oldProbability > Number(probability) &&
            oldProbability / Number(probability) > 10
          ) {
            // do nothing
          } else {
            newData[name] = ['U', 0];
          }
        } else {
          newData[name] = [gender as Gender, Number(probability)];
        }
      });

    setData(newData);
  }, [names.length]);

  // Papa.parse(csvFilePath, {
  //   worker: true,
  //   error: function (err: any) {
  //     console.log('Error:', err);
  //   },
  //   step: function (row) {
  //     console.log('Row:', row);
  //   },
  //   complete: function (results: any) {
  //     console.log('Finished!');
  //   },
  // });
  // csv()
  //   .fromFile(csvFilePath)
  //   .then((jsonObj) => {
  //     console.log(`json obj len`, jsonObj.length);
  //   });

  // useEffect(() => {
  //   if (!ready) {
  //     return;
  //   }
  //   fetch(url, { headers, method: 'POST', body: JSON.stringify(body) })
  //     .then((res) => res.json())
  //     .then((response: GenderResponse) => {
  //       console.log(`jsonData`, response);
  //       // if (isError(response)) {
  //       //   setError(response.title);
  //       // } else {
  //       const newData: Record<string, Gender> = {};
  //       response.forEach((res) => {
  //         newData[res.first_name] =
  //           res.result_found && res.probability > 0.6 ? res.gender : 'unisex';
  //       });
  //       setData(newData);
  //       setLoading(false);
  //       // }
  //     });
  // }, [url, ready, body]);
  return data; //{ data, loading, error };
};

export default useFirstNameGender;
