import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/index";
import Spinner from "react-bootstrap/Spinner";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

function Profile() {
    const updateemail = JSON.parse(localStorage.getItem("email") as string);
    const loggedInUser: string = updateemail;
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [dob, setDOB] = useState<any>("");
    const [loading, setLoading] = useState(false);
    const [dobShow, setDOBShow] = useState<any>([]);
    const [gender, setGender] = useState<string>("");
    const [aboutme, setaboutMe] = useState<string>("");
    const [profileImage, setProfileImage] = useState<File | null>(null);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/fetchdata/${updateemail}`)
            .then((res) => {
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setMobileNumber(res.data.Mobile);
                setDOB(res.data.DateofBirth);
                setGender(res.data.Gender);
                setaboutMe(res.data.aboutme);
                setProfileImage(res.data.profileImage);
            })
            .catch((err) => console.log(err));
    }, [updateemail]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setProfileImage(file);
        }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        if (profileImage) {
            formData.append("profileImage", profileImage as File);
        }
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("mobileNumber", mobileNumber);
        formData.append("dob", dob);
        formData.append("gender", gender);
        formData.append("aboutme", aboutme);
        axios
            .patch(`${process.env.REACT_APP_API_URL}/editprofile/${updateemail}`, formData)
            .then((res) => {
                const { firstName, lastName, mobileNumber, dob, gender, aboutme, image } = res.data;
                setFirstName(firstName);
                setLastName(lastName);
                setMobileNumber(mobileNumber);
                setDOB(dobShow);
                setGender(gender);
                setaboutMe(aboutme);
                setProfileImage(image);
            })
            .catch((err) => console.log(err));
            setTimeout(()=>{
                setLoading(false);
                navigate("/data/profile");
            },3000)
        
    };

    const dateFormatChange = (date: any) => {
        const offset = date.getTimezoneOffset()
        date = new Date(date.getTime() - (offset * 60 * 1000))
        return date.toISOString().split('T')[0]
    }
    return (
        <>
            {loggedInUser ? (
                <>
                    <Navbar /><br></br>
                    {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )}
                    <div>
                        <form onSubmit={handleSubmit} className="form-group">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mobileNumber">Number:</label>
                                <input type="tel" className="form-control"
                                    id="mobileNumber" value={mobileNumber} 
                                    onChange={(event) => setMobileNumber(event.target.value.replace(/[^\d+]/g, ""))}
                                    pattern="[0-9]{10,14}" maxLength={10} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">Gender:</label>
                                <select className="form-control" id="gender" value={gender} 
                                onChange={e => setGender(e.target.value)}>
                                    <option value="">--Please select an option--</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="dob">Date of Birth:</label>
                                <Flatpickr
                                    value={dob}
                                    className="form-control"
                                    onChange={(date: Date[]) => {
                                        setDOBShow(date);
                                        setDOB(dateFormatChange(date[0]));
                                    }}
                                    options={{
                                        dateFormat: "Y-m-d",
                                        maxDate: "today",
                                        disableMobile: true,
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="aboutme">About Me:</label>
                                <textarea className="form-control" id="about_Me" value={aboutme} maxLength={1000}
                                onChange={e => setaboutMe(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="profileImage">Profile Image:</label>
                                <input name="profile_Image" type="file" 
                                onChange={handleImageChange} />
                            </div>
                            <br></br>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>
                    </div>
                </>
            ) : ( navigate("/login") )
            }
        </>
    )
}
export default Profile
