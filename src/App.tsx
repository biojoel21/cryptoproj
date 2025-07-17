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
  const [selected, setSelected] = useState<Crypto[]>([]);  
  const [range, setRange] = useState<number>(30); // Default to 30 days

  /*
  const [data, setData] = useState<ChartData<'line'>>();
  const [options, setOptions] = useState<ChartOptions<'line'>>({
    responsive: true,
    plugins: {
      legend: {
        display:false,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  });
  */

  useEffect(() => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

  /*
  useEffect(() => {
    if (!selected) return;
    axios.get(`https://api.coingecko.com/api/v3/coins/${selected?.id}/market_chart?vs_currency=usd&days=${range}&interval=daily`).then((response) => {
      const prices = response.data.prices.map((price: [number, number]) => price[1]);
      const labels = response.data.prices.map((price: [number, number]) => new Date(price[0]).toLocaleDateString());
      setData({
        labels,
        datasets: [
          {
            label: `${selected?.name} Price`,
            data: prices,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });
      setOptions({ 
        responsive: true,
        plugins: {
          legend: {
            display:false,
          },
          title: {
            display: true,
            text: `${selected?.name} Price over last ` + range + (range === 1 ? ' Day.' : ' Days.'),
          },
        },
      });
    });
  }, [selected, range]);
  */

  useEffect(() => {
    console.log('Selected cryptos:', selected); 
  }, [selected]);

  function updatedOwned(crypto: Crypto, amount: number) : void {
      console.log('updatedOwned', crypto, amount);
      let temp = [...selected];
      let tempObj = temp.find((x) => x.id === crypto.id);
      if(tempObj) {
        tempObj.owned = amount;
        setSelected(temp);
      }
  }

  return (
    <>
      <div className="App">
        <select
          onChange={(e) => {
            const c = cryptos?.find((x) => x.id === e.target.value) as Crypto;
            setSelected([...selected,c]);            
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

      {selected.map((s) => {return <CryptoSummary crypto={s} updatedOwned={updatedOwned} />})}

      {/*selected ? <CryptoSummary crypto={selected} /> : null*/}
      {/*data ? <Line key={JSON.stringify(data)} options={options} data={data} /> : null */}
      {selected 
        ? 'Your portfolio is worth: $' +
        selected.map((s) => { 
          if(isNaN(s.owned)) { return 0 ;} return s.current_price * s.owned }).reduce((prev, current) => {return prev + current;}, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits : 2})
        : null}
    </>
  );
}

export default App;