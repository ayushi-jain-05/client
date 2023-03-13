import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css"
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import styles from "./styles.module.css";
import Spinner from "react-bootstrap/Spinner";
import { UserDetails,Profile,IGoogleOauthUser } from "../../interfaces";

const Login: React.FC = () => {
  const navigate = useNavigate();
 const [user, setUser] = useState<IGoogleOauthUser>();
  const [profile, setProfile] = useState<Profile>();
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [dob, setDOB] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState<string>("");
  const [aboutme, setaboutMe] = useState<string>("");
  const [checkUser, setcheckUser] = useState<boolean>();

  //google authentication
  const googleAuth = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userDetails: UserDetails = {
      mobileNumber,
      dob,
      gender,
      aboutme,
      loginTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      ...profile!,
    };
    if (!dob) {
      alert("Please select a date of birth.");
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/userdata`, userDetails);
    navigate("/data/profile");
  };

  useEffect(() => {

    user &&
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
        })
        .then(async (res) => {
          //to avoid duplicate entries
          localStorage.setItem("email", JSON.stringify(res.data.email));
          const now = new Date().getTime();
          localStorage.setItem("lastLoginTime", now.toString());
          let storeEmail= await axios.get(`${process.env.REACT_APP_API_URL}/getuser?email=${res.data.email}`);
          if (storeEmail?.data?.email) {
            setLoading(true)
            setcheckUser(true);
          } else {
            setcheckUser(false);
          }
          setProfile(res.data);
           setLoading(false)
        })
        .catch((err) => console.log(err));
    }
  , [user]);
  return (
    <div>
      {!user?.access_token && (
        <div >
          <h1 className={styles.heading}>Log in Form</h1><br></br>
          <div className={styles.form_container}>
            <div className={styles.right}>
              <button className={styles.google_btn} onClick={() => googleAuth()}>
                <img src="./images/google.png" alt="google icon" />
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <>
      {user?.access_token && checkUser === false ? (
        <>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )}
        <form onSubmit={handleSubmit}>
        <h3>Please provide more details</h3>
        <div className="form-group">
         <label htmlFor="mobileNumber">Mobile Number:</label>
         <input type="tel" id="mobile_Number" value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value.replace(/[^\d+]/g,""))} pattern="[0-9]{10,14}" maxLength={10}className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
              <Flatpickr
  value={dob} className="form-control" 
  onChange={(date: Date[]) => setDOB(date[0] ? date[0].toISOString().substr(0, 10) : "")}
  options={{
    dateFormat: "Y-m-d",
    maxDate: "today",
    disableMobile: true, 
  }}
/>
        </div>
        <div className="form-group">
          <label htmlFor="gender">Enter your gender:</label>
          <select id="gender" value={gender} onChange={(event) => setGender(event.target.value)} className="form-control" required>
             <option value="">Select gender</option>
             <option value="male">Male</option>
             <option value="female">Female</option>
             <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="aboutme">About Me:</label>
          <textarea id="about_Me" value={aboutme} onChange={(event) => setaboutMe(event.target.value)} className="form-control" required></textarea>
        </div>
        <br></br>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      </>
       ): 	checkUser===true?	navigate("/data/profile"): <div> </div>
      
 	}</>
 		</div>
 	);
 }
export default Login;