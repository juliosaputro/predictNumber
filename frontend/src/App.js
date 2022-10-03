import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";

const columns = [
  {
    field: "id",
    headerName: "No",
    sortlabel: false,
  },
  {
    field: "kepala",
    headerName: "Kepala",
    width: 150,
    editable: true,
  },
  {
    field: "ekor",
    headerName: "Ekor",
    width: 150,
    editable: true,
  },
  {
    field: "hasil",
    headerName: "Hasil",
    // type: 'number',
    width: 110,
    editable: true,
  },
];

const valueHasil = [
  {
    value: "genap",
    label: "genap",
  },
  {
    value: "ganjil",
    label: "ganjil",
  },
];

export default function App() {
  // const dataCollectionRef = collection(db, "angka");

  const [angka, setAngka] = useState([]);
  //respon
  const [totalData, setTotalData] = useState(0)
  const [totalEkor, setTotalEkor] = useState(0);
  const [totalKepala, setTotalKepala] = useState(0);
  const [totalHasil, setTotalHasil] = useState(0);
  const [datapredict, setDataPredict] = useState(0);

  //request keyword
  const [dataEkor, setDataEkor] = useState("");
  const [dataKepala, setDataKepala] = useState("");
  const [dataHasil, setDataHasil] = useState("");
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)

  // add data
  const [kepala, setKepala] = useState(0);
  const [ekor, setEkor] = useState(0);
  const [hasil, setHasil] = useState("");



  const getProbability = async () => {
    const response = await axios.get(
      `http://localhost:5000/angkas?search_kepala=${dataKepala}&search_ekor=${dataEkor}&search_hasil=${dataHasil}&page=${page}&limit=${limit}`
    );
    setAngka(response.data.result)
    setTotalData(response.data.totalData)
    setTotalKepala(response.data.totalDataKepala)
    setTotalEkor(response.data.totalDataEkor)
    setTotalHasil(response.data.totalDataHasil)
    setDataPredict(response.data.totalDataPredict)

  }

  //perhitungan

  const PEH = datapredict / totalHasil
  const Pkepala = totalKepala / totalData
  const Pekor = totalEkor / totalData
  const Phasil = totalHasil / totalData

  const propabilityEkor = Phasil * PEH/Pekor
  const probabilityKepala = Phasil * PEH/Pkepala
  const propabilityEkor1 = 1 - propabilityEkor
  const probabilityKepala2 = 1-probabilityKepala
  const pSatu = propabilityEkor * probabilityKepala
  const pdua = propabilityEkor1 * probabilityKepala2
  const probability = pSatu / (pSatu + pdua)

  // console.log(PEH, 'Totalnya')
  // console.log(Phasil, 'hasilnya')
  // console.log(Pekor, 'ekornya')
  // console.log(propability, 'probability')

  const AddData = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/angkas", {
        kepala,
        ekor,
        hasil,
      });
      alert("suksess ditambahkan");
    } catch (error) {
      console.log(error);
    }
    window.location.reload(true);
  };
  console.log(dataKepala, "kepala");
  console.log(dataEkor, "ekor");
  console.log(dataHasil, "hasil");

  

  return (
    <Box sx={{ height: 500, width: 500 }}>
      <Typography>Total Data Saat ini : {totalData}</Typography>
      <DataGrid
        rows={angka}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        style={{
          textAlign: "center",
          justifyContent: "center",
        }}
      />
      <Box>
        <TextField
          style={{ width: 80 }}
          label="kepala"
          onChange={(e) => {
            setKepala(e.target.value);
          }}
        />
        <TextField
          style={{ width: 80 }}
          label="ekor"
          onChange={(e) => {
            setEkor(e.target.value);
          }}
        />
        <TextField
          style={{ width: 120 }}
          select
          value={hasil}
          label="Select"
          onChange={(e) => {
            setHasil(e.target.value);
          }}
        >
          {valueHasil.map((x) => (
            <MenuItem key={x.value} value={x.value}>
              {x.label}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={AddData}>
          Tambah
        </Button>
      </Box>
      <Box>
        <TextField
          style={{ width: 80 }}
          label="kepala"
          onChange={(e) => {
            setDataKepala(e.target.value);
          }}
        />
        <TextField
          style={{ width: 80 }}
          label="ekor"
          onChange={(e) => {
            setDataEkor(e.target.value);
          }}
        />
        <TextField
          style={{ width: 120 }}
          select
          value={dataHasil}
          label="Select"
          onChange={(e) => {
            setDataHasil(e.target.value);
          }}
        >
          {valueHasil.map((x) => (
            <MenuItem key={x.value} value={x.value}>
              {x.label}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={getProbability}>Proses</Button>
      </Box>
      <Typography>Rules : </Typography>
      <Typography>1. select (ganjil/genap) sesuai Ekor</Typography>
      <Typography> 2. Apabila Probabilitas kecil betting dibalik</Typography>
      <Typography></Typography>
      <Typography>ProbabilitasEkor : {propabilityEkor}</Typography>
      <Typography>ProbabilitasKepala : {probabilityKepala}</Typography>
      <Typography>Probabilitas Berdasarkan input hasil : {probability}</Typography>
    </Box>
  );
}
