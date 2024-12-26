import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import "./LLMOutput.css"; 

const LLMOutput = () => {
  const [laptopss, setLaptops] = useState([]);
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const laptopName = location.state?.laptopName || "";
  console.log(laptopName);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const res = await axios.get("http://localhost:1234/merged");

        const { database1 = [], database2 = [] } = res.data;

        const laptopsFromDb1 = database1.map((item) => ({
          id: item.idx,
          name: item.name,
          os: item.os,
          price: item["price(in Rs.)"],
          displaySize: item["display(in inch)"],
          ram: item.ram,
          storage: item.storage,
          source: "DATABASE 1"
        }));

        const laptopsFromDb2 = database2.map((item, index) => ({
          id: index + 1000,
          name: `${item.Manufacturer} ${item["Model Name"]}`,
          os: item["Operating System"],
          price: item["Price (Euros)"],
          displaySize: item["Screen Size"],
          ram: item.RAM,
          storage: item[" Storage"],
          source: "DATABASE 2"
        }));

        const mergedLaptops = [...laptopsFromDb1, ...laptopsFromDb2];

        const filteredLaptops = mergedLaptops.filter((laptop) => 
          laptop.name.toLowerCase().includes(laptopName.toLowerCase())
        );

        setLaptops(filteredLaptops);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLaptops();
  }, [laptopName]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="data-container">
      <h1>Laptop Details</h1>
      {laptopss.length === 0 ? (
        <div className="empty-message">No laptops found.</div>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'black' , backgroundColor : "#00A9FF"}}>Laptop Name</TableCell>
                  <TableCell align="right" sx={{ color: 'black' , backgroundColor : "#00A9FF"}}>OS</TableCell>
                  <TableCell align="right" sx={{ color: 'black' , backgroundColor : "#00A9FF"}}>Price</TableCell>
                  <TableCell align="right" sx={{ color: 'black' , backgroundColor : "#00A9FF"}}>Display Size</TableCell>
                  <TableCell align="right" sx={{ color: 'black', backgroundColor : "#00A9FF" }}>RAM</TableCell>
                  <TableCell align="right" sx={{ color: 'black', backgroundColor : "#00A9FF" }}>Storage</TableCell>
                  <TableCell align="right" sx={{ color: 'black', backgroundColor : "#00A9FF" }}>Source</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {laptopss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((laptop) => (
                  <TableRow key={laptop.id}>
                    <TableCell component="th" scope="row" sx={{ color: 'black' , backgroundColor: "white"}}> 
                      {laptop.name}
                    </TableCell>
                    <TableCell align="right">{laptop.os}</TableCell>
                    <TableCell align="right">{laptop.price}</TableCell>
                    <TableCell align="right">{laptop.displaySize}"</TableCell>
                    <TableCell align="right">{laptop.ram}</TableCell>
                    <TableCell align="right">{laptop.storage}</TableCell>
                    <TableCell align="right">{laptop.source || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={laptopss.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </div>
  );
};

export default LLMOutput;
