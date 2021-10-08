import { GoogleAuthProvider, getAuth, signInWithPopup, GithubAuthProvider, FacebookAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import './App.css';
import initializeAuthentication from "./firebase.initialize";
import img from './images/picture6.jfif';
import './LoginTest.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";

initializeAuthentication();

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();


function App() {
  //Set useState for email, password and error
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({})

  //universal for all
  const auth = getAuth();


  //Google SIgn In
  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          img: photoURL
        };
        setUser(loggedInUser);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  //Facebook SIgn in
  const handleFacebookLogin = () => {
    signInWithPopup(auth, facebookProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          img: photoURL
        };
        setUser(loggedInUser);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });    
  }

  //Github sign in 
  const handleGithubLogin = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        console.log(user);
        const loggedInUser = {
          name: displayName,
          email: email,
          img: photoURL
        }
        setUser(loggedInUser);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
      });

  }
  //SetUser Name
  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {

    }).catch((error) => {

    });
  }

  //Sign Out
  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser({});
    })
  }

  //Register or login
  const toggleLogin = e => {
    setIsLogin(e.target.checked);
  }

  //Take and Set Name
  const handleNameChange = e => {
    setName(e.target.value);
  }
  //Take and Email
  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  // Take And set Password
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  //Register
  const handleRegister = e => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be 6 character long');
      return;
    }
    if (!/(?=.*[!@#$&*])/.test(password)) {
      setError('PassWord must be one special letter');
      return;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      setError('PassWord must be one upper case');
      return;
    }
    if (!/(?=.*[0-9].*[0-9])/.test(password)) {
      setError('Password must be include with two numbers');
      return;
    }

    //Condition For Sign In and Register.Function for sign in and register.
    isLogin ? processLogin(email, password) : createNewUser(email, password)


  }
  //For Sign In Function
  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setError('')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  //For Register Function
  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        verifyEmail();
        setError('');
        setUserName('');
        alert("Congratulation, Your account is registered and an EMail is sent to your email account")
      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        // Email verification sent!
        // ...
      });
  }

  //Reset Password
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('An Email was sent to Your Email.')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  return (
    <div className=" bg-image">

      {/* Register */}
      <div className="container container-fluid mt-4">
        <div className="row g-0 shadow-lg p-3 mb-5 bg-body rounded">
          <div className="col-md-6 img-fluid images">
            <img src={img} alt="" />
          </div>
          <div className="col-md-6">
            <form onSubmit={handleRegister}>
              <div className="container p-4 p-md-5 border rounded-3 bg-light sign-in pb-4">
                <h1 className="d-flex justify-content-center align-items-center login-title">{isLogin ? 'Login' : 'Register'}</h1>

                {!isLogin &&
                  <div className="form-floating mt-5 mb-3">
                    <input type="text" name="userName" id="floatingInput1" placeholder="Enter Your Name" className="form-control" required onBlur={handleNameChange} />
                    <label htmlFor="floatingInput1">UserName</label>
                  </div>}

                <div className="form-floating mt-5 mb-3 pb-4">
                  <input type="email" name="email" id="floatingInput" placeholder="name@example.com" className="form-control" required onBlur={handleEmailChange} />
                  <label htmlFor="floatingInput">Email address</label>
                </div>

                <div className="form-floating mb-3">
                  <input type="password" name="password" id="floatingPassword" placeholder="Password" className="form-control" required onBlur={handlePasswordChange} />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="row mb-3">
                  <div className="col-sm-10 offset-sm-2">
                    <div className="form-check">
                      <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
                      <label className="form-check-label" htmlFor="gridCheck1">
                        Already Registered?Then click the Checkbox.
                      </label>
                    </div>
                  </div>
                </div>
                <h3 className="text-danger">{error}</h3>
                <div className="mx-auto text-center">
                  <button type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Register'}</button>
                  <button type="button" onClick={handleResetPassword} className="btn btn-info m-4 text-white">Reset Password</button>
                  {!user.email &&
                    <div>
                      <button className="btn btn-primary text-white me-3 rounded-circle" onClick={handleGoogleLogin}><FontAwesomeIcon icon={faGoogle} /></button>
                      <button className="btn btn-danger me-3 rounded-circle" onClick={handleGithubLogin}><FontAwesomeIcon icon={faGithub} /></button>
                      <button className="btn btn-primary text-white rounded-circle" onClick={handleFacebookLogin} ><FontAwesomeIcon icon={faFacebook} /></button>
                    </div> }
                </div>

                <hr className="my-4" />
                <small className="text-muted pb-4 text-center">By clicking sign up, you agree to the terms of use.</small>
              </div>
            </form>
          </div>
        </div>
      </div>


      <br /><br /><br /><br />
      <br /><br /><br /><br />
      <div>---------------------------------------</div>
      {!user.email ?
        <div>
          <button className="btn btn-primary text-white me-3 rounded-circle" onClick={handleGoogleLogin}><FontAwesomeIcon icon={faGoogle} /></button>
          <button className="btn btn-danger me-3 rounded-circle" onClick={handleGithubLogin}><FontAwesomeIcon icon={faGithub} /></button>
          <button className="btn btn-primary text-white rounded-circle" onClick={handleFacebookLogin} ><FontAwesomeIcon icon={faFacebook} /></button>
        </div> :
        <button onClick={handleSignOut}>Sign Out</button>}
      <br />
      {
        user.email && <div>
          <h2>Welcome {user.name}</h2>
          <p>Your Email is : {user.email}</p>
          <img src={user.img} alt="" />
        </div>
      }

    </div>
  );
}

export default App;
