import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Snackbar } from '@mui/material';
import Addcar from './Addcar';
import Editcar from './Editcar';
import React, { useState, useEffect } from 'react';

const Carlist = () => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [rowData, setRowData] = useState([]);

  const handleClick = () => {
    setOpen(true);
  };

  const deleteCar = (params) => {
    if (window.confirm('Are you sure?')) {
      fetch(params.data._links.car.href, { method: 'DELETE' })
        .then((response) => {
          if (response.ok) {
            const updatedData = rowData.filter((row) => row !== params.data);
            setRowData(updatedData);
            setMsg('Car deleted');
            setOpen(true);
          } else {
            response.text().then((data) => {
              setMsg(`Error in deletion: ${response.status} - ${data}`);
              setOpen(true);
            });
          }
        })
        .catch((err) => {
          setMsg(`Error in deletion: ${err.message}`);
          setOpen(true);
        });
    }
  };

  const saveCar = (car) => {
    fetch('http://carrestapi.herokuapp.com/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    })
      .then(() => fetchData())
      .catch((err) => console.error(err));
  };

  const updateCar = (car, link) => {
    fetch(link, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    })
      .then(() => fetchData())
      .catch((err) => console.error(err));
  };

  const fetchData = () => {
    fetch('http://carrestapi.herokuapp.com/cars')
      .then((response) => response.json())
      .then((data) => setRowData(data._embedded.cars))
      .catch((error) => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    { headerName: 'Brand', field: 'brand', sortable: true, filter: true, floatingFilter: true  },
    { headerName: 'Model', field: 'model' , sortable: true, filter: true, floatingFilter: true },
    { headerName: 'Color', field: 'color' , sortable: true, filter: true, floatingFilter: true },
    { headerName: 'Fuel', field: 'fuel', sortable: true, filter: true, floatingFilter: true  },
    { headerName: 'Year', field: 'year' , sortable: true, filter: true, floatingFilter: true },
    { headerName: 'Price', field: 'price', sortable: true, filter: true, floatingFilter: true  },
    {cellRenderer: params => <Editcar updateCar={updateCar} car={params.data} />

     
         ,
         width: 120,}
    ,
        {cellRenderer: params => 
          <button size="small" color='error' onClick={() => deleteCar(params)}>
            Delete
          </button>
        ,
        width: 120,
      }
      
  ];
  




  return (
    <>
        <Addcar saveCar={saveCar}/>
 <div className="ag-theme-alpine" style={{ height: '700px', width: '1200px', margin: 'auto' }}>

        <AgGridReact
        
          rowData={rowData}
          columnDefs={columns}
          animateRows={true}
          pagination={true}
          onGridReady={() => fetchData()}
       
        />
        <Snackbar open={open}
        autoHideDuration={3000}
        onClose={()=>setOpen(false)}
        message={msg}/>
      </div>
    </>
  );
};

export default Carlist;
