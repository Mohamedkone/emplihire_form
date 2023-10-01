/* eslint-disable react-hooks/rules-of-hooks */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  Icon,
  Text,
  CircularProgress,
} from '@chakra-ui/react';

import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { RiUpload2Fill } from 'react-icons/ri';
import {AiOutlineFilePdf} from 'react-icons/ai'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import axios from 'axios';




export default function multistep() {
  const queryString = window.location.search;

// Create a new URLSearchParams object with the query string
const searchParams = new URLSearchParams(queryString);

// Retrieve the value of a specific parameter
const paramJob = searchParams.get('apply');
const paramComp = searchParams.get('c');

  const [status, setStatus] = useState(0)
  // const [complete, setComplete] = useState(0)
  const [fname, setfname] = useState('')
  const [mname, setmname] = useState('')
  const [lname, setlname] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [sponsorship, setSponsorship] = useState('');
  const [stdate, setStdate] = useState('');
  const today = new Date()
  const month = today.getMonth() + 1; // getMonth() returns 0-indexed values, so add 1 to get the actual month number
  const day = today.getDate();
  const year = today.getFullYear();
  const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState({
    fname: '',
    lname: '',
    email: '',
    number: '',
    country: '',
    region: '',
    city: '',
    zip: '',
    eligibility: '',
    sponsorship: '',
    stdate: '',
    selectedFile: '',
  });


  const [dragActive, setDragActive] = useState(false);
  const [ skills, setSkills ] = useState({})

  useEffect(()=>{
    const originalConsoleError = console.error;
console.error = () => {}; 
    async function fetchData() {
      try {
        const check = await axios.get(`https://arianodelb4.herokuapp.com/jobs/${paramJob}/${paramComp}`);
        setSkills(check.data.json)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setStatus(3);
        }
      }finally {
        console.error = originalConsoleError; // Restore console.error
      }
    }
    
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleSubmit = () => {
    let isValid = true;

    if (!fname) {
      setErrors((prevState) => ({ ...prevState, fname: 'First name is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, fname: '' }))}

    if (!lname) {
      setErrors((prevState) => ({ ...prevState, lname: 'Last name is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, lname: '' }))}

    if (!email) {
      setErrors((prevState) => ({ ...prevState, email: 'Email is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, email: '' }))}

    if (number.length < 10 ) {
      setErrors((prevState) => ({ ...prevState, number: 'Phone number is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, number: '' }));}

    if (!country) {
      setErrors((prevState) => ({ ...prevState, country: 'Country is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, country: '' }))}

    if (!region) {
      setErrors((prevState) => ({ ...prevState, region: 'Region is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, region: '' }))}
    if (!city) {
      setErrors((prevState) => ({ ...prevState, city: 'City is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, city: '' }))}
    if (!zip) {
      setErrors((prevState) => ({ ...prevState, zip: 'ZIP is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, zip: '' }))}

    if (!eligibility) {
      setErrors((prevState) => ({ ...prevState, eligibility: 'Eligibility is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, eligibility: '' }))}

    if (!sponsorship) {
      setErrors((prevState) => ({ ...prevState, sponsorship: 'Sponsorship is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, sponsorship: '' }))}

    if (!stdate) {
      setErrors((prevState) => ({ ...prevState, stdate: 'Start date is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, stdate: '' }))}

    if (!selectedFile) {
      setErrors((prevState) => ({ ...prevState, selectedFile: 'Resume is required' }));
      isValid = false;
    }else{setErrors((prevState) => ({ ...prevState, selectedFile: '' }))}

    if (isValid) {
      // If all fields are valid, submit the form or perform any additional actions
      setStatus(1)
      sendApp()
    }
  };
  const sendApp = async() =>{
    if (selectedFile) {
      let formData = new FormData();
      formData.append('file', selectedFile);

      try { 
        // Send the file to the server
        const res = await axios.post('https://mypythontestaria.herokuapp.com/analyse', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
          const skillCheckRes = await axios.post('https://mypythontestaria.herokuapp.com/skill', {
            text: res.data[1],
            skills: skills,
          });

          await axios.post('https://arianodelb4.herokuapp.com/summarize', {
            filename: res.data[0],
            parsed: res.data[1],
          }).then(async(res)=>{

            
            const nodeRes = await axios.post('https://arianodelb4.herokuapp.com/applicants', {
              "jobId": paramJob,
              "fname": fname,
              "mname": mname,
              "lname": lname,
              "email": email,
              "pNumber": parseInt(number),
              "country": country,
              "spr": region,
              "zip": zip,
              "visa":  eligibility?false:true,
              "sponsorship": sponsorship?true:false,
              "interviewing": false,
              "status": 0,
              "summary": res.data.message,
              "resPath": res.data.filename,
              "atsDate":  new Date(stdate),
              "json": skillCheckRes.data
            })
            if (nodeRes.status === 200) {
              setStatus(2);
              setTimeout(() => {
                window.close();
              }, 5000);
            }
          });
          } catch (error) {
            console.error(error);
            setStatus(status - 1);
          }
        }
    };

  
  const handleCountryChange = (value) => {
    setCountry(value);
  };
  
  const handleRegionChange = (value) => {
    setRegion(value);
  };
  
   // Hook for navigating to other pages

  // Ref for the input element
  const inref = useRef<HTMLInputElement | null>(null);

  // Constant for the red color used in the component
  const redColor = '#DF6557';

  // Event handler for when the file input changes
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    
    // Define the maximum allowed file size (e.g., 5MB)
    const maxSize = 2 * 1024 * 1024;
  
    if (file && file.size > maxSize) {
      alert('File size exceeds the allowed limit (2MB).');
    } else {
      setSelectedFile(file);
    }
  }
  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };
  
  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  
    const file = event.dataTransfer.files[0];
    const maxSize = 2 * 1024 * 1024;
  
    if (file && file.size > maxSize) {
      alert('File size exceeds the allowed limit (2MB).');
    } else {
      setSelectedFile(file);
    }
  };

  // Function for uploading the file to the server
  // Event handler for when the upload area is clicked
  const uploadbtnMouse = (event:  React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
    event.preventDefault();
    
    // Trigger the input element's click event
    if (inref.current) {
      inref.current.click();
    }
  };
  const application =[
      <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form">

        {/* Start Main form code */}

        <Heading w="100%" my={5} textAlign={'center'} fontWeight="normal">
        Info
      </Heading>

      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight={'normal'}>
            First name<span>*</span>
          </FormLabel>
          <Input isRequired id="first-name" placeholder="First name" value={fname} onChange={(e)=>setfname(e.target.value)} />
          {errors.fname && <Text color="red">{errors.fname}</Text>}
        </FormControl>

        <FormControl mr='5%'>
          <FormLabel htmlFor="middle-name" fontWeight={'normal'}>
            Middle name
          </FormLabel>
          <Input  id="middle-name" placeholder="Middle name" value={mname} onChange={(e)=>setmname(e.target.value)}/>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="last-name" fontWeight={'normal'}>
            Last name<span>*</span>
          </FormLabel>
          <Input isRequired id="last-name" placeholder="Last name" value={lname} onChange={(e)=>setlname(e.target.value)} />
          {errors.lname && <Text color="red">{errors.lname}</Text>}
        </FormControl>
      </Flex>
      <FormControl mt="2%">
        <FormLabel htmlFor="email" fontWeight={'normal'}>
          Email address<span>*</span>
        </FormLabel>
        <Input isRequired id="email" type="email"  placeholder='email...' value={email} onChange={(e)=>setEmail(e.target.value)} />
        {errors.email && <Text color="red">{errors.email}</Text>}
      </FormControl>
      <FormControl mt="2%">
        <FormLabel htmlFor="number" fontWeight={'normal'}>
          Phone Number<span>*</span>
        </FormLabel>
        <PhoneInput placeholder='+x xxxxxxxxxx' country={'us'} value={number} onChange={(e)=>setNumber(e)} />
        {errors.number && <Text color="red">{errors.number}</Text>}
      </FormControl>
      
      <Heading w="100%" my={5} textAlign={'center'} fontWeight="normal" mb="2%">
        Details
      </Heading>
      <FormControl as={GridItem} colSpan={[6, 3]}>
        <FormLabel
          htmlFor="country"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}>
          Country / Region<span>*</span>
        </FormLabel>
        {/* eslint-disable-next-line react/prop-types */}
        <CountryDropdown
        value={country}
        onChange={handleCountryChange}
        classes={'chakra-input css-r8f0h4'}
        
        />
        {errors.country && <Text color="red">{errors.country}</Text>}
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
        <FormLabel
          htmlFor="city"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%">
          State / Province / Region<span>*</span>
        </FormLabel>
        <RegionDropdown
        // style={{minWidth:'300px', boxShadow:'0 1px 2px 0 rgba(0, 0, 0, 0.05)', outline: '2px solid transparent'}}
        classes='chakra-input css-r8f0h4'
        country={country}
        value={region}
        onChange={handleRegionChange}
        disableWhenEmpty
        />
        {errors.region && <Text color="red">{errors.region}</Text>}
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="state"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%">
          City<span>*</span>
        </FormLabel>
        <Input
        isRequired
        type="text"
        name="state"
        id="state"
        autoComplete="state"
        focusBorderColor="brand.400"
        shadow="sm"
        size="sm"
        w="full"
        rounded="md"
        width={'300px'}
        placeholder='Enter City'
        onChange={(e)=>setCity(e.target.value)}
        />
        {errors.city && <Text color="red">{errors.city}</Text>}
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="postal_code"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%">
          ZIP / Postal<span>*</span>
        </FormLabel>
        <Input
          type="text"
          name="postal_code"
          id="postal_code"
          autoComplete="postal-code"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="100px"
          rounded="md"
          isRequired
          onChange={(e)=>setZip(e.target.value)}
          />
          {errors.zip && <Text color="red">{errors.zip}</Text>}
      </FormControl>

      <Heading w="100%" my={5} textAlign={'center'} fontWeight="normal" mb="2%">
        Residency
      </Heading>
      <FormControl mt="2%">
        <FormLabel htmlFor="email" fontWeight={'normal'}>
          Are You legally eligible to work in the U.S.?<span>*</span>
        </FormLabel>
        <Select id="eligibility" maxWidth={'100px'} defaultValue={eligibility} onChange={(e)=>setEligibility(e.target.value)} isRequired>
          <option value="" disabled hidden>--</option>
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </Select>
        {errors.eligibility && <Text color="red">{errors.eligibility}</Text>}
      </FormControl>
      <FormControl mt="2%">
        <FormLabel htmlFor="email" fontWeight={'normal'}>
          Do you or will you in the futur need sponsorship?<span>*</span>
        </FormLabel>
        <Select id="sponsorship" maxWidth={'100px'} defaultValue={sponsorship} onChange={(e)=>setSponsorship(e.target.value)} isRequired>
          <option value="" disabled hidden>--</option>
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </Select>
        {errors.sponsorship && <Text color="red">{errors.sponsorship}</Text>}
      </FormControl>
      <FormControl mt="2%">
        <FormLabel htmlFor="startDate" fontWeight={'normal'}>
          When will you be available to start ?<span>*</span>
        </FormLabel>
        <Input id='startDate' type='date' width={'200px'} min={formattedDate} isRequired value={stdate} onChange={(e)=>{setStdate(e.target.value)}}/>
        {errors.stdate && <Text color="red">{errors.stdate}</Text>}
      </FormControl>

      <Heading w="100%" my={5} textAlign={'center'} fontWeight="normal">
        Resume
      </Heading>
      <Flex justifyContent={'center'}>
        <FormControl>
          <FormLabel htmlFor="email" fontWeight={'normal'} textAlign={'center'}>
            Upload your resume<span>*</span>
          </FormLabel>
          <Box 
          display='flex' 
          flexDir='column'
          justifyContent='center'
          alignItems='center' 
          width={{ base:'300px', md:'500px' }} 
          height={{ base:'50px', md:'100px' }} 
          border={dragActive ? `5px dashed ${redColor}` : '5px dashed #666'}
          borderRadius='20px'
          marginBottom='40px'
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>uploadbtnMouse(e)}
          as='button'
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}

          margin={'auto'}
          >
            <Icon
            as={selectedFile? AiOutlineFilePdf : RiUpload2Fill}
            fontSize= {50} 
            color={selectedFile? redColor : '#666'}
            />
            <p>{selectedFile? `${selectedFile.name}`:'Click Here or Drag and Drop The File'}</p>
          </Box>

          <Input hidden
          ref={inref}
          type="file" 
          id="file-upload" 
          onChange={handleFileChange} 
          accept=".pdf"
          isRequired
          name='upload-file'
          />
          {/* <FormHelperText>Choose a resume to analyse</FormHelperText> */}
          {/* <FormErrorMessage>You need to choose a file</FormErrorMessage> */}
          {errors.selectedFile && <Text color="red">{errors.selectedFile}</Text>}
        </FormControl>
      </Flex>

        {/* End Main form code */}

      <Flex justifyContent={'center'} my={10} >
        <Button
          w="7rem"
          colorScheme="red"
          variant="solid"
          onClick={()=>handleSubmit()}
        >
          Submit
        </Button>
        </Flex>
      </Box>
    </>,
    <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'} height={'100dvh'}>
    <CircularProgress isIndeterminate size={'100px'}/>
    </Flex>
    ,
    <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'} height={'100dvh'}>
    <Heading as={'h1'}>Your application was sent</Heading>
    <Text>You can now close this window...</Text>
    </Flex>,
    <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'} height={'100dvh'}>
    <Heading as={'h1'}>This page does not exist</Heading>
    <Text>You can now close this window...</Text>
    </Flex>,
    ]
  return (
    <>
      {application[status]}
      
    </>
  );
}