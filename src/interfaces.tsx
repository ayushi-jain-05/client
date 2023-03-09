export interface UserDetails {
    mobileNumber: string;
    dob: string;
    gender: string;
    aboutme: string;
    loginTime: string;
  }
  
export  interface Profile {
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
  }

 export interface UserData {
    _id: string;
    firstName: string;
    lastName: string;
    Gender: string;
    DateofBirth: string;
    email: string;
    Mobile: string;
    aboutme: string,
    loginTime: string;
    image: string;
    google_image: string;
  }
export interface IGoogleOauthUser{
    access_token: string,
    authuser?: string,
    expires_in: number,
    prompt: string,
    scope: string,
    token_type: string
}