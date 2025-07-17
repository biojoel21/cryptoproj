import { JSX } from 'react';
import { Crypto } from '../Types';
import { useState, useEffect } from 'react';

export type AppProps = {
    crypto: Crypto;
    updatedOwned: (crypto: Crypto, amount: number) => void;
}

export default function CryptoSummary({crypto, updatedOwned}: AppProps) : JSX.Element {

    useEffect(() => {});

    const [amount, setAmount] = useState<number>(0);
    return (
        <div>
        <span>{crypto.name + ' $' + crypto.current_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits : 2})}</span>
        <input 
            type="number"
            style={{margin: 10}} 
            value={amount} 
            onChange={(e) => {
                    setAmount(parseFloat(e.target.value))
                    updatedOwned(crypto, parseFloat(e.target.value));
                }} >
        </input>
        <p>{isNaN(amount) ? '$0.00' : '$' + (crypto.current_price * amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits : 2})}</p>
        </div>        
    );
}