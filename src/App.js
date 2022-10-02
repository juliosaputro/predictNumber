import React, {useEffect, useState} from "react";
import { DataGrid } from "@mui/x-data-grid";
import {db} from './firebase'
import { FirebaseApp } from "firebase/app";
import {
  collection,
  getDocs,
  doc,
  query,
  orderBy,
  where,
  addDoc,
  Timestamp,
  deleteDoc
} from "firebase/firestore"
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography
} from '@mui/material'


const columns = [
  {
    field:'id',
    headerName:'Hapus',
    sortlabel:false,
    renderCell:(params)=>{
      const deleteData = async () => {
        const angkaDoc = doc(db, "angka", params.id)
        await deleteDoc(angkaDoc)
        window.location.reload(true)
      }
      return <Button onClick={deleteData}>Hapus</Button>
    }
  },
  {
    field: 'kepala',
    headerName: 'Kepala',
    width: 150,
    editable: true,
  },
  {
    field: 'ekor',
    headerName: 'Ekor',
    width: 150,
    editable: true,
  },
  {
    field: 'hasil',
    headerName: 'Hasil',
    // type: 'number',
    width: 110,
    editable: true,
  },
];

const valueHasil = [
  {
    value:'genap',
    label:'genap'
  },
  {
    value:'ganjil',
    label:'ganjil'
  }
]

export default function App() {

  const dataCollectionRef = collection(db, "angka");

  const [angka, setAngka] = useState([])
  const [newkepala, setNewkepala] = useState(0)
  const [newekor, setNewEkor] = useState(0)
  const [newhasil, setNewhasil] = useState("")

  useEffect(()=>{
    const getAngka = async () => {
      const data = await getDocs(query(dataCollectionRef, orderBy('created', 'desc')));
      setAngka(data.docs.map((doc)=> ({...doc.data(), id:doc.id})))
    }
    getAngka()
  },[])

  const AddData = async () => {
    await addDoc(dataCollectionRef, {
      kepala:parseInt(newkepala),
      ekor:parseInt(newekor),
      hasil:newhasil,
      created: Timestamp.now()
    });
    window.location.reload(true)
  }

  

  // predict naive bayes
  const [dataEkor, setDataEkor] = useState()
  const [dataKepala, setDataKepala] = useState()
  const [dataHasil, setDataHasil] = useState("")
  const [totalEkor, setTotalEkor] = useState([])
  const [totalKepala, setTotalKepala] = useState([])
  const [totalHasil, setTotalHasil] = useState([])
  const [datapredict, setDataPredict] = useState([])
  const [dataKepalaPredict, setDataKepalaPredict] = useState([])


  useEffect(()=>{
    const getKepala = async () => {
      const data = await getDocs(query(dataCollectionRef,where('kepala', '==', parseInt(dataKepala))));
      setTotalKepala(data.docs.map((doc)=> ({...doc.data(), id:doc.id})))
    }
    getKepala()
  },[dataKepala])

  useEffect(()=>{
    const getEkor = async () => {
      const data = await getDocs(query(dataCollectionRef,where('ekor', '==', parseInt(dataEkor))));
      setTotalEkor(data.docs.map((doc)=> ({...doc.data(), id:doc.id})))
    }
    getEkor()
  },[dataEkor])

  useEffect(()=>{
    const getHasil = async () => {
      const data = await getDocs(query(dataCollectionRef,where('hasil', '==', dataHasil)));
      setTotalHasil(data.docs.map((doc)=> ({...doc.data(), id:doc.id})))
    }
    getHasil()
  },[dataHasil])

  useEffect(()=>{
    const getHasil = async () => {
      const data = await getDocs(query(dataCollectionRef,where('hasil', '==', dataHasil), where('ekor', '==', parseInt(dataEkor)) ));
      setDataPredict(data.docs.map((doc)=> ({...doc.data(), id:doc.id})))
    }
    getHasil()
  },[dataHasil, dataEkor])
  
  console.log(totalEkor.length, 'ekor')
  console.log(totalHasil.length, 'hasil')
  console.log(datapredict.length, 'predict')
  console.log(angka.length, 'angka')
 
  //perhitungan

  const PEH = datapredict.length / totalHasil.length
  const Pkepala = totalKepala.length / angka.length
  const Pekor = totalEkor.length / angka.length
  const Phasil = totalHasil.length / angka.length

  const propabilityEkor = Phasil * PEH/Pekor
  const probabilityKepala = Phasil * PEH/Pkepala
  const propabilityEkor1 = 1 - propabilityEkor
  const probabilityKepala2 = 1-probabilityKepala
  const pSatu = propabilityEkor * probabilityKepala
  const pdua = propabilityEkor1 * probabilityKepala2
  const probability = pSatu / (pSatu + pdua)


  console.log(PEH, 'Totalnya')
  console.log(Phasil, 'hasilnya')
  console.log(Pekor, 'ekornya')
  // console.log(propability, 'probability')

  return (
    <Box sx={{height:500, width:500}}>
      <DataGrid
      rows={angka}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      style={{
        textAlign:'center',
        justifyContent:'center'
      }}
      />
      <Box>
      <TextField style={{ width:80}} label='kepala' onChange={((e)=> {
        setNewkepala(e.target.value)
      })}/>
      <TextField style={{ width:80}} label='ekor' onChange={((e)=> {
        setNewEkor(e.target.value)
      })}/>
      <TextField style={{ width:120}} select value={newhasil} label='Select' onChange={((e)=> {
        setNewhasil(e.target.value)
      })}>
        {
          valueHasil.map((x)=>(
            <MenuItem key={x.value} value={x.value}>
              {x.label}
            </MenuItem>
          ))
        }
      </TextField>
      <Button variant="contained" onClick={AddData}>Tambah</Button>
      </Box>
      <Box>
        <TextField style={{ width:80}} label='kepala' onChange={((e)=> {
          setDataKepala(e.target.value)
        })}/>
      <TextField style={{ width:80}} label='ekor' onChange={((e)=> {
        setDataEkor(e.target.value)
      })}/>
      <TextField style={{ width:120}} select value={dataHasil} label='Select' onChange={((e)=> {
        setDataHasil(e.target.value)
      })}>
        {
          valueHasil.map((x)=>(
            <MenuItem key={x.value} value={x.value}>
              {x.label}
            </MenuItem>
          ))
        }
      </TextField>
      {/* <Button variant="contained" onClick={AddData}>Proses</Button> */}
      </Box>
      <Typography>Rules : </Typography>
      <Typography>1. select (ganjil/genap) sesuai Ekor</Typography>
      <Typography>   2. Apabila Probabilitas kecil betting dibalik</Typography>
      <Typography></Typography>
      <Typography>ProbabilitasEkor : {propabilityEkor}</Typography>
      <Typography>ProbabilitasKepala : {probabilityKepala}</Typography>
      <Typography>Probabilitas Berdasarkan input hasil : {probability}</Typography>
    </Box>
  )
}
