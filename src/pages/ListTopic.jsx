import React, {useEffect, useState} from 'react'
import Lateral from "../components/Lateral"
import NavBar from "../components/NavBar";
import PaginationTopics from '../components/Topics/PaginationTopics'

const ListTopic = () => {
  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(false);
    useEffect(() => {
      setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/topics`)
          .then((res) => {
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }
            return res.json();
          })
          .then(
            (result) => {
              setData(result.data);
              setLoading(false);
            }
          )
          .catch((error) => {
            console.log('Fetch error:', error);
            setLoading(false);
          });
      }, []);
    
  return (
    <div id="page-top">
      <div id="wrapper">
        <Lateral />
        <div className="d-flex flex-column" id="content-wrapper">
          <NavBar />
          {data.length > 0 && <PaginationTopics data={data} loading={loading}/>}
        </div>
      </div>
    </div>
  )
}

export default ListTopic