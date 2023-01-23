import { useEffect, useState } from 'react';
import { Entry } from './ResultsTable';
import { DateTime } from 'luxon';
import useFirstNameGender from './useFirstNameGender';

interface BirthPage {
  normalizedtitle: string;
  title: string;
  description: string;
}
interface BirthEntry {
  text: string;
  year: number;
  pages: BirthPage[];
}
interface Deaths {}
interface Events {}
interface Holidays {}
interface Selected {}
interface WikipediaSuccess {
  births: BirthEntry[];
  deaths: Deaths;
  events: Events;
  holidays: Holidays;
  selected: Selected;
}
interface WikipediaError {
  type: string;
  title: string;
  method: string;
  detail?: string;
  uri?: string;
}

type WikipediaResponse = WikipediaSuccess | WikipediaError;

function isError(response: WikipediaResponse): response is WikipediaError {
  return (response as WikipediaError).type !== undefined;
}

const useWikipedia = (date: DateTime) => {
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${date.month}/${date.day}`;

  const [data, setData] = useState<Omit<Entry, 'gender' | 'id'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((response: WikipediaResponse) => {
        console.log(`jsonData`, response);
        if (isError(response)) {
          setError(response.title);
        } else {
          const newData = response.births.map((birthEntry) => {
            const { text, year, pages } = birthEntry;
            const page =
              pages.find((p) => p.description !== 'Day of the year') ??
              pages[0];
            const fullName = page.title.replaceAll('_', ' ');
            const firstName = fullName.split(' ')[0];
            return {
              fullName,
              firstName,
              year,
              significance: 'Born',
              description: text,
              link: 'todo.com',
            };
          });

          setData(newData);
          setLoading(false);
        }
      });
  }, [url]);

  return { data, loading, error };
};

export default useWikipedia;
