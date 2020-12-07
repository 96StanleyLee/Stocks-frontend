import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
});

function createData(ticker, current, previous, change) {
  return { ticker, current, previous, change };
}

const Portfolio = (props) => {
  const classes = useStyles();

  let [portfolio, setPortfolio] = useState([]);
  let [rows, setRows] = useState([]);
  let [loading, setLoading] = useState(true);

  const createRows = () => {
    let array = [];
    portfolio.forEach((stock) => {
      console.log(stock);
      array.push(createData(stock[0], stock[1], stock[2]));
    });
    setRows(array);
  };

  useEffect(() => {
    const fetchStock = async () => {
      let array = [];
      if (props.portfolio.length > 0) {
        for (let i = 0; i < props.portfolio.length; i++) {
          let data = await fetch(
            `https://api.twelvedata.com/time_series?symbol=${props.portfolio[i].ticker}&interval=1min&apikey=f13f1aa5682d46e098172a34c233cd20`
          );
          let secondData = await fetch(
            `https://api.twelvedata.com/time_series?symbol=${props.portfolio[i].ticker}&interval=1day&apikey=f13f1aa5682d46e098172a34c233cd20`
          );
          data = await data.json();
          secondData = await secondData.json();
          console.log(data);
          array.push([
            data.meta.symbol,
            data.values[0].close,
            secondData.values[0].open,
          ]);
        }
        setPortfolio(array);
        setLoading(false);
      }
    };

    fetchStock();
  }, [props.portfolio]);

  useEffect(() => {
    createRows();
  }, [portfolio]);

  return (
    <>
      {Cookies.get("token") === undefined ? <Redirect to="/" /> : null}

      {loading ? (
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <TableContainer
          style={{ margin: "auto", width: "80%" }}
          component={Paper}
        >
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Ticker</TableCell>
                <TableCell align="right">Current</TableCell>
                <TableCell align="right">Previous</TableCell>
                <TableCell align="right">Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell
                    component="th"
                    scope="row"
                    onClick={() => props.history.push(`/stocks/${row.ticker}`)}
                  >
                    {row.ticker}
                  </TableCell>
                  <TableCell align="right">{row.current}</TableCell>
                  <TableCell align="right">{row.previous}</TableCell>
                  {row.current - row.previous > 1 ? (
                    <TableCell align="right" style={{ color: "green" }}>
                      {(row.current - row.previous).toFixed(4)}%
                    </TableCell>
                  ) : (
                    <TableCell align="right" style={{ color: "red" }}>
                      {(row.current - row.previous).toFixed(4)}%
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default Portfolio;
