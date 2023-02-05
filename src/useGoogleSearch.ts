import { useEffect, useState } from 'react';
import { Entry } from './ResultsTable';
import { DateTime } from 'luxon';

const MEANINGS: {[key: string]: string} = {};

interface GoogleSearchResponse {
  items: {
    snippet: 'string';
  }[];
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

const useGoogleSearch = (names: string[]) => {
  const token = 'AIzaSyAiZkOC41Uma_MBPHqilyccWNYC19l_nIw';
  const searchEngineId = '269a95388f7094d2b';

  // todo: all names

  const [data, setData] = useState<Record<string, string> | null>(null);

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('');

  useEffect(() => {
    names.forEach((name) => {

      if (MEANINGS[name]) {
        return;
      }

      //
      const url = `https://customsearch.googleapis.com/customsearch/v1/siterestrict?cx=${searchEngineId}&q=${name}%20name%20meaning&key=${token}`;

      // const url = `https://www.googleapis.com/customsearch/v1/siterestrict?cx=${searchEngineId}&q=${name}%20name%20meaning&key=${token}`;

      fetch(url)
        .then((res) => res.json())
        .then((response: GoogleSearchResponse) => {
          if (!response.items) {
            console.log(`No items`, response);
          } else {
            const meanings = response.items
              .map((item) => {
                const extractQuote = item.snippet.match(/(?:"[^"]*"|^[^"]*$)/);
                return extractQuote ? extractQuote[0].replace(/"/g, '') : null;
              })
              .filter(notEmpty);
            // const meaningSnippet = response.items.find((item) => {
            //   console.log(`item.snippet`, item.snippet);
            //   item.snippet.includes('"') || item.snippet.includes('&quot;');
            // })?.snippet;

            // console.log(`Google meaningSnippet`, name, meaningSnippet);

            // const meaning = meaningSnippet?.match(/"([^\"]+)"/) ?? null;
            if (meanings[0]) {
              MEANINGS[name] = meanings[0];
              setData({ ...data, [name]: meanings[0] });
              console.log(`data:`, data);
            }

            // console.log(`Google meaning`, name, meaning[]);
          }
          // const newData = response.births.map((birthEntry) => {
          //   const { text, year, pages } = birthEntry;
          //   const page =
          //     pages.find((p) => p.description !== 'Day of the year') ?? pages[0];
          //   const fullName = page.title.replaceAll('_', ' ');
          //   const firstName = fullName.split(' ')[0];
          //   return {
          //     fullName,
          //     firstName,
          //     year,
          //     significance: 'Born',
          //     description: text,
          //     link: 'todo.com',
          //   };
          // });

          // setData(newData);
          // setLoading(false);
        });
    });
  }, [data, names.length]);

  return MEANINGS;
};

export default useGoogleSearch;
