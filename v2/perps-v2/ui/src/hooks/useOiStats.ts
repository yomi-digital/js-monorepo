import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiResponse {
  result: {
    rows: Row[];
  };
}

interface Row {
  short: number;
  long: number;
  day: string;
}

const UseOiStats = (DUNE_API_KEY: string, period: 'M' | 'Y') => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [totalDailyFee, setTotalDailyFee] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.dune.com/api/v1/query/2648712/results?api_key=${DUNE_API_KEY}`
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

        const groupByMonth = (rows: Row[]) => {
          return rows.reduce((acc: any, row) => {
            const date = new Date(row.day);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            acc[monthKey] = acc[monthKey] || {
              short: 0,
              long: 0,
              day: `${date.getFullYear()}-${date.getMonth() + 1}`,
            };
            acc[monthKey].short += row.short;
            acc[monthKey].long += row.long;
            return acc;
          }, {});
        };

        const monthlyData: Row[] = Object.values(groupByMonth(sortedData.result.rows)) as Row[];

        const transformedRows = period === 'Y' ? sortedData.result.rows : monthlyData;
        const transformedRowsFormatted: Row[] = transformedRows.map((row: Row) => {
          const date = new Date(row.day);
          const formattedDate = date.toLocaleString('en-EN', {
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
          });

          return {
            ...row,
            dayFormatted: formattedDate,
          };
        });

        setData({
          ...sortedData,
          result: {
            ...sortedData.result,
            rows: transformedRowsFormatted,
          },
        });

        // setTotalDailyFee(totalDailyFee);
        setError(null);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [DUNE_API_KEY, period]);

  // totalDailyFee
  return { data, error, loading };
};

export default UseOiStats;
