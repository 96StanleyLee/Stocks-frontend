import React, { useEffect } from 'react'


const StockPage = (props) =>{


    useEffect(()=>{

        let symbol = props.match.params.id
        
        const grabStock = async ()=>{
            let data = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=42fc1c23cb4e45fead5a847310693625`)
            let json = await data.json()

            
        }


    },[])

    
    return(
        <h1> hi</h1>
    )
}

export default StockPage