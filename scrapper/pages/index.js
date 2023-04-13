import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import io from 'socket.io-client';
import socketIOClient from 'socket.io-client';

export default function Home() {
  const [job, setJob] = useState('')
  const [user, setUser] = useState('')
  const [jobLocation, setJobLocation] = useState('')
  const [company, setCompany] = useState('')
  const [results, setResults] = useState([])
  const [loader, setLoader] = useState(false)
  const [companyLocation, setCompanyLocation] = useState()
  const [userLocation, setUserLocation] = useState()
  const [companyRocker, setCompanyRocker] = useState('Results')
  const [error, setError] = useState(false)
  const [companySize, setCompanySize] = useState('');

  const handleChange = (event) => {
    setCompanySize(event.target.value);
  };


  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }, [error]);

  useEffect(() => {
    const socket = socketIOClient('http://localhost:4000');
    socket.on('connect', () => {
      console.log('Connected to stream');
    });
    socket.on('data', (data) => {
      console.log(data)
    });
    let arr = []
    socket.on('companies', (response) => {
      if (response) {
        if (response.length > 20) {
          setLoader(true)
          const range = document.createRange();
          const fragment = range.createContextualFragment(response);
          let item = fragment.querySelector('.mb1 .app-aware-link')
          if (item) {
            arr.push({ link: item.getAttribute('href'), text: item.textContent })
            setLoader(false)
            console.log(results)
            setResults([...results, ...arr])
          }
        }
      }
    })

    socket.on('profiles', (response) => {
      console.log('somthing 111111111111111111111111')
      if (response) {
        if (response.length > 20) {
          console.log('hello world 00000000000000000000000000')
          setLoader(true)
          const range = document.createRange();
          const fragment = range.createContextualFragment(response);
          console.log(fragment)
          let item = fragment.querySelector('.artdeco-entity-lockup  .artdeco-entity-lockup__title a')
          if(!item){
            item = fragment.querySelector('.entity-result__content  .mb1 .app-aware-link ')
          }
          // let item2 = fragment.querySelector('.relative job-card-list  .mb1 .app-aware-link  span span')
          console.log(item)
          if (item) {
            let itemlink = `https://www.linkedin.com/${item.getAttribute('href')}`
            arr.push({ link: itemlink, text: item.innerText })
            console.log(arr)
            setLoader(false)
            setResults([...results, ...arr])
          }
        }
      }
    })

    socket.on('jobs', (response) => {
      if (response.length > 20) {
        setLoader(true)
        const range = document.createRange();
        const fragment = range.createContextualFragment(response);
        let item = fragment.querySelector('.job-card-container .job-card-list__entity-lockup .artdeco-entity-lockup__content .job-card-container__link')
        if (item?.getAttribute('href')) {
          arr.push({ link: item.getAttribute('href'), text: item.innerText })
        } else {
          console.log('red alert-----', item)
        }
        console.log(arr)
        setLoader(false)
        setResults([...results, ...arr])
      }
    })

    socket.on('companyRocker', (response) => {
      setCompanyRocker(response)
    })

    socket.on('error', (response) => {
      setError(true)
    })


  }, [])

  const handleJob = async () => {
    setResults([])
    if (job == '') {
      return
    }
    let query2 = job
    setLoader(true)
    const res = await axios.get(`http://localhost:4000/jobs/?name=${query2}/?location=${jobLocation}`);
    const response = res.data
    // if (res.data == '') {
    //   setResults('No Data Found')
    // }
    // let results = []
    // for (let i = 0; i < response.length; i++) {
    //   const range = document.createRange();
    //   const fragment = range.createContextualFragment(response[0]);
    //   const linkElement = fragment.querySelector('a');
    //   const link = linkElement.getAttribute('href')
    //   const title = linkElement.innerHTML.trim()
    //   results = [...results, { link, title }]
    // }
    // setLoader(false)
    // setResults(results)
  }

  const handleProfiles = async () => {
    setResults([])
    let query2 = user
    setLoader(true)
    const res = await axios.get(`http://localhost:4000/profiles/?name=${query2}/?location=${userLocation}`);
    const response = res.data
  }

  const handleCompanies = async () => {
    console.log('compnaies caleed')
    setResults([])
    let query2 = company
    setLoader(true)
    const res = await axios.post(`http://localhost:4000/companies/?name=${query2}/?location=${companyLocation}/?size=${companySize}`);
    const response = res.data
  }

  const handleSubmit = () => {

  }

  console.log(results)


  return (
    <>
      <Head>
        <title>Linkedin Scrapper</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} style={{ gap: '0.5rem' }}>

        {
          error &&
          <div id="alert-additional-content-2" class="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
            <div class="flex items-center">
              <svg aria-hidden="true" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
              <span class="sr-only">Info</span>
              <h3 class="text-lg font-medium">Something went wrong Please Try again later</h3>
            </div>
          </div>
        }

        <div class="flex">
          <div class="w-1/3 mx-2">
            <form onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }} method="POST">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 px-4 py-5 sm:p-6 dark:border-gray-700 dark:text-gray-400  dark:bg-gray-800">
                  <div className="grid">
                    <div className="w-full flex align-bottom gap-1 justify-end flex-col" style={{ alignItems: 'flex-end' }}>
                      <div className='w-full flex flex-col'>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Search Job</label>
                        <input type="text" value={job} onChange={(e) => setJob(e.target.value)} id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96" placeholder="Job title" required />
                      </div>
                      <div className='w-full flex flex-col'>
                        <input type="text" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96" placeholder="Job Location" required />
                      </div>
                      <div style={{ height: 'fit-content' }}>
                        <button onClick={handleJob} className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="w-1/3 mx-2">
            <form onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }} method="POST">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 px-4 py-5 sm:p-6 dark:border-gray-700 dark:text-gray-400  dark:bg-gray-800">
                  <div className="grid">
                    <div className="w-full flex align-bottom gap-1 justify-end flex-col" style={{ alignItems: 'flex-end' }}>
                      <div className='w-full flex flex-col'>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Search Users</label>
                        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96" placeholder="Search Users" required />
                      </div>
                      <div className='w-full flex flex-col'>
                        <input type="text" value={userLocation} onChange={(e) => setUserLocation(e.target.value)} id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96" placeholder="Search Users Location" required />
                      </div>
                      <div style={{ height: 'fit-content' }}>
                        <button onClick={handleProfiles} className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="w-1/3 mx-2">
            <form onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }} method="POST">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 px-4 py-5 sm:p-6 dark:border-gray-700 dark:text-gray-400  dark:bg-gray-800">
                  <div className="grid">
                    <div className="w-full flex align-bottom gap-1 justify-end flex-col" style={{ alignItems: 'flex-end' }}>
                      <div className='w-full flex flex-col'>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Search Companies</label>
                        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96" placeholder="Search Companies" required />
                      </div>
                      <div className='w-full flex flex-col'>
                        <input type="text" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96" placeholder="Company Location" required />
                      </div>
                      <div className='w-full flex flex-col'>
                        <select value={companySize} onChange={handleChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96'>
                          <option value="">Select company size</option>
                          <option value="0">1-10</option>
                          <option value="1">11-50</option>
                          <option value="2">51-200</option>
                          <option value="3">201-500</option>
                          <option value="4">501-1000</option>
                          <option value="5">1001-5000</option>
                          <option value="6">5001-10000</option>
                          <option value="7">10000+</option>
                        </select>
                      </div>
                      <div style={{ height: 'fit-content' }}>
                        <button onClick={() => {
                          if (company.length != 0) {
                            handleCompanies()
                          }
                        }} className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

          </div>
        </div>

        <div style={{ width: '100%' }} className="shadow sm:overflow-hidden sm:rounded-md mt-5">
          <div style={{ overflow: 'scroll', height: '460px', overflowX: 'clip' }} className="space-y-6 px-4 py-5 sm:p-6 dark:border-gray-700 dark:text-gray-400  dark:bg-gray-800">
            <div className="grid">
              <div className="w-full flex flex-col">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center">{!results.length > 0 ? companyRocker : `${results.length} records loaded... Loading Next 10`}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {
                    loader ?
                      <div className='flex justify-center'>
                        <div role="status">
                          <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                      :
                      !results ?
                        <p>
                          Results Goes Here
                        </p>
                        :
                        results?.map((item, index) => {
                          return <div className="grid w-1/5" key={index} style={{ border: '1px solid #2d5986', padding: '1rem' }}>
                            <div className="w-full flex align-bottom gap-1 justify-center flex-col" style={{ alignItems: 'center' }}>
                              <div className='w-full flex flex-col justify-center'>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center">{item?.text}</label>
                              </div>
                              <div style={{ height: 'fit-content' }}>
                                <button onClick={() => {
                                  window.location.href = `${item.link}`
                                }} className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">See Details</button>
                              </div>
                            </div>
                          </div>
                        })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}