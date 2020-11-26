import React,{useState, useEffect} from 'react';
import {Formik,Form,Field,} from 'formik';
import TextField from "@material-ui/core/TextField"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
const useStyles = makeStyles((theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    body:{
      maxWidth: '500px',
      margin: 'auto'
    },
    title:{
      fontFamily:'Arial',       
      color:'red',
      fontSize:'48px',
      textAlign:'center',
      fontWeight:'bolder',
    },
    subtilte:{
      textAlign:'center',
      fontFamily:'Arial',
      wordSpacing:'14px',
      marginTop:'-35px',
      padding:'0 30px 50px 15px',
      color:'#AB0416',
      fontWeight:'bold',
      
    },
   
    
  }),
);
export default function Home(){
  const classes = useStyles();
   
    const [mydata, setData] = useState();
    const [fetchdata, setFetchdata] = useState(false);
    const [updatingData, setUpdatingData] = useState(undefined)
    const [updateData, setUpdateData] = useState(false)

    const handleOpenUpdate = () => {
      setUpdateData(true);
    };
  
    const handleCloseUpdate = () => {
      setUpdateData(false);
    };
    useEffect(()=>{
      fetch(`/.netlify/functions/read`)
      .then(response => response.json())
      .then(data => {
        setData(data.data)
        console.log(data.data)
      })
      .catch(e =>{
        console.log(e)
      })
        
        
    },[fetchdata])
    const updatemessage = (id) => {
      var updateData = mydata.find(messa=>messa.ref["@ref"].id === id)
      setUpdatingData(updateData)
    }

    const deletemessage = (deletedata)=>{
      fetch(`/.netlify/functions/delete`,{
        method: 'post',
        body: JSON.stringify({id:deletedata.ref["@ref"].id})
      })
      .then(response => response.json())
      .then(data => {
        setFetchdata(data)
      })
    }

    const createBody = (
      <Formik
      initialValues={{name:"",email:""}}
      onSubmit={(value,action)=>{
        
        fetch(`/.netlify/functions/create`,{
          method:'post',
          body: JSON.stringify(value),
        })
        setFetchdata(true)
        action.resetForm({
          values:{
            
            name:"",
            email:""
          },
        })
        setFetchdata(false)
        
      }}
      
    >{formik => (
      <Form
      onSubmit={formik.handleSubmit}
      >
        
        <Field
        style={{padding:"0 10px 5px 0"}}
        variant="outlined"
        as={TextField}
        id="name"
        label="Your Name"
        name="name"
        type="text"
        required
        />
        <Field
        style={{padding:"0 10px 5px 0"}}
        variant="outlined"
        as={TextField}
        id="email"
        label="Your Email"
        name="email"
        type="email"
        required
        
        />
        <br/>
        
        <Button type="submit" variant="contained"   style={{backgroundColor:"red" ,color:"white"}}>ADD</Button>
        
      </Form>
    )}</Formik>
    
    )
    const updateBody = (
      <Formik
      initialValues={{ 
      name:updatingData !== undefined ? 
      updatingData.data.name: "",
      email:updatingData !== undefined ? 
      updatingData.data.email: "",
      }}
      onSubmit={(value,action)=>{
        fetch(`/.netlify/functions/update`,{
          method:'post',
          body: JSON.stringify({
            detail: value.detail,
            id:updatingData.ref["@ref"].id,
          }),
        })
        setFetchdata(true)
        action.resetForm({
          values:{
             
            name:"",
            email:""
          },
        })
        setFetchdata(false)
        handleCloseUpdate()
      }}
      
    >{formik => (
      <Form
      onSubmit={formik.handleSubmit}
      >
        <Field
        as={TextField}
        id="name"
        label="name"
        name="name"
        type="text"
        style={{padding:"0 10px 5px 0"}}
        variant="outlined"
        />
        <Field
        as={TextField}
        id="email"
        label="Update email"
        name="email"
        type="text"
        style={{padding:"0 10px 5px 0"}}
        variant="outlined"
        />
        <br/>
         
        <br/>
        <Button type="submit" variant="contained" color="primary">update</Button>
        <Button type="button" variant="contained" onClick={handleCloseUpdate}>close</Button>
      </Form>
    )}</Formik>
      )
      return(
        <div className={classes.body}>
          <h2 className={classes.title}>CRUD</h2>
           

          <Box m={1} p={1}>
          {createBody}
          </Box>
          
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={updateData}
        onClose={handleCloseUpdate}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
      <div className={classes.paper}>
        {updateBody}
        
      </div>
        
        </Modal>
       
        {mydata === null || mydata === undefined ? (
    <div>
      <CircularProgress/>
    </div>
  ):mydata.length >= 1 ? (
    
    <Box >
      <Box m={1} p={1} >
      
        {mydata.map((ind,i)=>(
           
          
          
        
          <Box  key={i} m={1} p={1} style={{boxSizing:"content-box",border:"5px solid red",borderRadius:"20px" ,backgroundColor:"white"}}>
           <Box p={1}  >
            <p style={{paddingRight:"50%px"}}>
              {ind.data.name}
              </p>
              <p>
                {ind.data.email}
              </p>
              </Box>
               

            <Button color="primary" onClick={()=>{
            handleOpenUpdate()
            updatemessage(ind.ref["@ref"].id)
            }}>update</Button>
            <Button color="secondary" onClick={()=>{
              deletemessage(ind)
            }}>Delete</Button>
          </Box>
          
        ))}
      </Box>
    </Box>
  ):(
    <div style={{padding:"10px 10px 10px 10px "}}>empty</div>
  )}
        </div>
      )
  }

 /* */