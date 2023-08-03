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

const UsePnlStats = (DUNE_API_KEY: string) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalDailyFee, setTotalDailyFee] = useState<number>(0);

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

        const transformedRows: Row[] = sortedData.result.rows.map((row: Row) => {
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

        const totalDailyFee = transformedRows.reduce((total, row) => total + row.total_pnl, 0);

        setData({
          ...sortedData,
          result: {
            ...sortedData.result,
            rows: transformedRows,
          },
        });
        setTotalDailyFee(totalDailyFee);
        setError(null);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [DUNE_API_KEY]);

  return { data, error, loading, totalDailyFee };
};

export default UsePnlStats;
