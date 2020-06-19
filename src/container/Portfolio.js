import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
      minWidth: 450
    },
  });
  
  function createData(ticker, current, previous, change) {
    return { ticker, current, previous, change};
  }
  
  // const rows = [
  // createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  //   createData('Eclair', 262, 16.0, 24, 6.0),
  //   createData('Cupcake', 305, 3.7, 67, 4.3),
  //   createData('Gingerbread', 356, 16.0, 49, 3.9),
  // ];


const Portfolio = (props) =>{
    const classes = useStyles();

    // const rows = [
    //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    // ]

    let [portfolio, setPortfolio] = useState([])
    let [rows, setRows] = useState([])


    const createRows = () =>{
      let array = []
      portfolio.forEach(stock =>{
        console.log(stock)
        array.push(createData(stock[0],stock[1], stock[2]))
      })

      setRows(array)
    }

    useEffect(() =>{
      const fetchStock = async () =>{
        let array = []
        if(props.portfolio.length > 0 ){
          for(let i = 0; i<props.portfolio.length; i++){
            let data = await fetch(`https://api.twelvedata.com/time_series?symbol=${props.portfolio[i].ticker}&interval=1min&apikey=f13f1aa5682d46e098172a34c233cd20`)
            let secondData = await fetch(`https://api.twelvedata.com/time_series?symbol=${props.portfolio[i].ticker}&interval=1day&apikey=f13f1aa5682d46e098172a34c233cd20`)
            data = await data.json()
            secondData = await secondData.json()
            array.push([data.meta.symbol,data.values[0].close,secondData.values[0].open])
          }    
          setPortfolio(array)
        }
      }

      fetchStock()
    },[props.portfolio])

    useEffect(()=>{
      createRows()
    },[portfolio])

    



    


    return(
        <TableContainer style={{margin:'auto',width: '80%'} }component={Paper}>
      <Table  className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            {/* <TableCell align="right">Ticker</TableCell> */}
            <TableCell align="right">Current&nbsp;(g)</TableCell>
            <TableCell align="right">Previous&nbsp;(g)</TableCell>
            {/* <TableCell align="right">Change&nbsp;(g)</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.ticker}
              </TableCell>
              {/* <TableCell align="right">{row.ticker}</TableCell> */}
              <TableCell align="right">{row.current}</TableCell>
              <TableCell align="right">{row.previous}</TableCell>
              {/* <TableCell align="right">{row.protein}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
}


export default Portfolio