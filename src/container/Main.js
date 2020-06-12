//7DNK3UZB58TIL716
import React, {useEffect, useState} from 'react'
import Chart from 'react-apexcharts'
import Button from '@material-ui/core/Button';


const Main = (props) =>{

    let close
    const [stock, setStock] = useState({})    
    const [chart, setChart] = useState([])
    const [options,setOptions] = useState({})
    const [valid, setValid] = useState(true)





  

    useEffect(()=>{
    const grabStock = async ()=>{
            let stock = props.stock
            if(!props.stock){
                stock = props.match.params.id
            }

            let data = await fetch(`https://api.twelvedata.com/time_series?symbol=${stock}&interval=1day&apikey=42fc1c23cb4e45fead5a847310693625`)
            let json = await data.json()
            if(json.status === "ok"){
                setValid(true)
                setStock(json)
            }
            else{
                setValid(false)
            }
    }
    grabStock()
    },[props])





    useEffect(()=>{
        let series = 
            [{
                data:[]
            }]
        if(stock.values !== undefined){
            stock.values.forEach(value => {
                series[0].data.push({
                    x: value.datetime,
                    y: [parseFloat(value.open), parseFloat(value.high), parseFloat(value.low), parseFloat(value.close)]
                })
            })

            const help = () =>{
                setChart([])
                setChart(series)
                setOptions({chart: {
                    type: 'candlestick',
                    height: 350
                  },
                  title: {
                    text: 'CandleStick Chart',
                    align: 'left'
                  },
                  xaxis: {
                    type: 'datetime'
                  },
                  yaxis: {
                    tooltip: {
                      enabled: true
                    }
                  }})
            }
            help()

        }
    },[stock])
    
    if(stock.meta !== undefined){
        close = parseFloat(stock.values[0].close) > parseFloat(stock.values[0].open)? {color :'green'}: {color: 'red'}
    }
   

 
    return(
        <>
        {valid === false? <h1> This stock doesn't exist!</h1> :null}
        {stock.meta !== undefined?
        <>
        <h1> {stock.meta.symbol} </h1>
        {Object.keys(props.user).length > 0 ? <Button variant="contained" onClick={()=>props.add(stock.meta.symbol)}>Add to Portfolio</Button>:null}
        <h2> Last Refreshed: {stock.values[0].datetime} </h2> 
        <h3> Opening: {stock.values[0].open} </h3>
        <h3 style={close}> Closing: {stock.values[0].close} </h3>
        <Chart options={options} series={chart} type="candlestick" height={350}/>
        </>
        : null}

        </>
    )
}

export default Main