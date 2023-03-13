import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Navbar from "../Navbar/index";
import Spinner from "react-bootstrap/Spinner";
import { UserData } from "../../interfaces";
import styles from "./styles.module.css";

let val = ""
export default function UserProfile() {
  const loggedInUser: string = JSON.parse(localStorage.getItem("email") as string)
  const [userData, setUserData] = useState<UserData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(4);
  const [isNext, setisNext] = useState<boolean>(true);
  const [totalResult, setTotalResult] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filterdata, setFilterdata] = useState<number>(1);       //searchpage
  const [search, setSearch] = useState<string>("")
  let [actualData, setActualData] = useState<UserData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [reset,setReset] = useState<number>(1);

  //LastLoginTime
  const [lastLoginTime, setLastLoginTime] = useState(localStorage.getItem("lastLoginTime"));
  if (lastLoginTime) {
    const lastLoginDate = new Date(parseInt(lastLoginTime));
    const formattedLastLoginTime = format(lastLoginDate, "MMM dd, yyyy HH:mm");
    val = formattedLastLoginTime
  }

  //fetchdata from backend
  const getData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/fetchdata?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let temp = await response.json();
      if (temp.length === 0) {
        setisNext(false);
      }
      setUserData(temp.user);
      setTotalResult(Number(temp.totalResults));
    }
    catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //Pagination
  const changePage = (type: string) => {
    if (type === "prev") {
      setPage((old) => old - 1);
    } else if (type === "next") {
      setPage((old) => old + 1);
    }
  };

  useEffect(() => {
    if(search === "")
    {
      getData();
    }else
    {
      getSearchData();
    }
  }, [page,reset]);

  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      if(page ===1){
        getSearchData();
      }
      else{
        setPage(1);
      }
    }
  };

  // Onclick search button
   const onSearch =() =>{
    if(page ===1){
      getSearchData();
    }
    else{
      setPage(1);
    }
   }
  //Search Reset
  const onClickReset = () => {
    setPage(1);
    setReset((old) =>old +1);
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.value = "";
    }
    setSearch("");
  }

  //Searching
  const getSearchData = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/fetchsearchdata/${search}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let temp = await response.json();
    setUserData(temp.user)
    setTotalResult(Number(temp.totalResults))
    setLoading(false)
  }
  return (
        <div className={styles.App}>
    <>
    {loggedInUser ? (
      <>
        <Navbar/>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )}

         <br></br>
          <div className="topnav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ marginLeft: "500px" }}><p className="text-muted mb-0" style={{ textAlign: "right" }}>Last Login Time: {val}</p></span></div>
          </div>
          <br></br>
          <div className="ui search">
            <div className="input-group mb-3">
              <input type="text" ref={inputRef} className="form-control" placeholder="Search User from First Name, Last Name, Email and Mobile Number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} onKeyDown = {handleKeypress}/>
              <button
                className="btn btn-primary "
                type="submit"
                style={{ width: "10%", height: "50px" }}
                onClick={onSearch}
              >
                Search
              </button>
              <button
                className="btn btn-danger "
                type="submit"
                style={{ width: "10%", height: "50px" }}
                onClick={onClickReset} >
                Reset
              </button>
            </div>
          </div>
          <br></br>
          <table className="table table-bordered table-hover table-responsive-md" id="details">
  <thead className="thead-light">
    <tr>
      <th scope="col">First Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">Gender</th>
      <th scope="col">Date of Birth</th>
      <th scope="col">Email</th>
      <th scope="col">Mobile Number</th>
      <th scope="col">About Me</th>
      <th scope="col">Profile Picture</th>
    </tr>
  </thead>
  <tbody>
    {userData.map((el) => (
      <tr key={el._id}>
        <td>{el.firstName}</td>
        <td>{el.lastName}</td>
        <td>{el.Gender}</td>
        <td>{el.DateofBirth}</td>
        <td>{el.email}</td>
        <td>{el.Mobile}</td>
        <td>{el.aboutme}</td>
        <td><img src={el.image ? `${process.env.REACT_APP_API_URL}/${el.image}` : el.google_image} alt="profile" className="img-thumbnail" /></td>
      </tr>
    ))}
  </tbody>
</table>
          <br></br>
          <h5>Total users: {totalResult}</h5>
          
          <div className="btn-group" role="group" aria-label="Pagination buttons" >
            <button type="button" className="btn btn-secondary" onClick={() => changePage("prev")} disabled={page === 1}>
              Previous
            </button> 
            <button type="button" className="btn btn-secondary" onClick={() => changePage("next")} disabled={page + 1 > Math.ceil(totalResult / limit)}>
              Next
            </button>
          </div>
      </>) : (
        navigate("/login")
        )
}
    </>
        </div>
  )
}
