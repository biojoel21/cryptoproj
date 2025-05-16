import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CryptoSummary from './components/CryptoSummary';
import { Crypto } from './Types';
import React from 'react';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto | null>();
  const [data, setData] = useState<ChartData<'line'>>();
  const [options, setOptions] = useState<ChartOptions<'line'>>({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  });

  useEffect(() => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

  return (
    <>
      <div className="App">
        <select
          onChange={(e) => {
            const c = cryptos?.find((x) => x.id === e.target.value);
            setSelected(c);
            axios.get(`https://api.coingecko.com/api/v3/coins/${c?.id}/market_chart?vs_currency=usd&days=30&interval=daily`).then((response) => {
              const prices = response.data.prices.map((price: [number, number]) => price[1]);
              const labels = response.data.prices.map((price: [number, number]) => new Date(price[0]).toLocaleDateString());
              setData({
                labels,
                datasets: [
                  {
                    label: `${c?.name} Price`,
                    data: prices,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  },
                ],
              });
            });
          }}
          defaultValue="default"
        >
          <option value="default">Select a crypto</option>
          {cryptos ?
            cryptos.map((crypto) => {
              return (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name}
                </option>
              );
            })
            : null}
        </select>
      </div>
      {selected ? <CryptoSummary crypto={selected} /> : null}
      {data ? <div style={{ width: 600}}
              ><Line key={JSON.stringify(data)} options={options} data={data} /></div> 
              : null}
    </>
  );
}

export default App;