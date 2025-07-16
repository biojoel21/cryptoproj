import { JSX } from 'react';
import { Crypto } from '../Types';
import { useState, useEffect } from 'react';

export type AppProps = {
    crypto: Crypto;
}

export default function CryptoSummary({crypto}: AppProps) : JSX.Element {

    useEffect(() => {});

    const [amount, setAmount] = useState<string>('0');
    return (
        <div>
        <span>{crypto.name + ' $' + crypto.current_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits : 2})}</span>
        <input 
            type="number"
            style={{margin: 10}} 
            value={amount} 
            onChange={(e) => {setAmount(e.target.value)}} >
        </input>
        <p>${(crypto.current_price * parseFloat(amount)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits : 2})}</p>
        </div>        
    );
}