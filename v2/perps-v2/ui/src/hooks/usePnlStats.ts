import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiResponse {
  result: {
    rows: Row[];
  };
}

interface Row {
  daily_fee: number;
  daily_pnl: number;
  day: string;
  dayFormatted?: string;
  loss: number;
  net_to_stakers: number;
  profit: number;
  total_fees: number;
  total_pnl: number;
}

const UsePnlStats = (DUNE_API_KEY: string, period: 'W' | 'M' | 'Y') => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastStakers, setLastStakers] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.dune.com/api/v1/query/2429954/results?api_key=${DUNE_API_KEY}`
        );

        const sortedData: ApiResponse = {
          ...response.data,
          result: {
            ...response.data.result,
            rows: [...response.data.result.rows].sort(
              (a, b) => Date.parse(a.day) - Date.parse(b.day)
            ),
          },
        };

        const currentDate = new Date();
        const filteredRows = sortedData.result.rows.filter((row: Row) => {
          const rowDate = new Date(row.day);
          switch (period) {
            case 'W':
              return rowDate.getTime() >= currentDate.getTime() - 7 * 24 * 60 * 60 * 1000; // Last 7 days
            case 'M':
              return (
                rowDate.getTime() >=
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  currentDate.getDate()
                ).getTime()
              ); // Last month
            case 'Y':
              return (
                rowDate.getTime() >=
                new Date(
                  currentDate.getFullYear() - 1,
                  currentDate.getMonth(),
                  currentDate.getDate()
                ).getTime()
              ); // Last year
            default:
              return true;
          }
        });

        const transformedRows: Row[] = filteredRows.map((row: Row) => {
          const date = new Date(row.day);
          let formattedDate;

          switch (period) {
            case 'W':
              formattedDate = date.toLocaleString('en-EN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC',
              });
              break;
            case 'M':
              formattedDate = date.toLocaleString('en-EN', {
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC',
              });
              break;
            case 'Y':
              formattedDate = date.toLocaleString('en-EN', {
                month: 'short',
                year: '2-digit',
                timeZone: 'UTC',
              });
              break;
            default:
              formattedDate = date.toLocaleString('en-EN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC',
              });
          }

          return {
            ...row,
            dayFormatted: formattedDate,
          };
        });

        const lastRow = transformedRows[transformedRows.length - 1];
        const lastStakers = lastRow.total_pnl;

        setData({
          ...sortedData,
          result: {
            ...sortedData.result,
            rows: transformedRows,
          },
        });
        setLastStakers(lastStakers);
        setError(null);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [DUNE_API_KEY, period]);

  return { data, error, loading, lastStakers };
};

export default UsePnlStats;
