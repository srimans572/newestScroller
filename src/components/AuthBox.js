import React, { useState } from "react";
import PrivacyPolicyPopup from "./Privacy";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase/Firebase";
import { db } from "./firebase/Firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthBox = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState(0);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const sendPasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Please provide a valid email.");
    }
  };

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Show verification message
      setMode(1);
      setVerificationMessage(
        "A verification email has been sent to your email address. Please check your inbox."
      );
      setError(false);

      console.log("User registered, verification email sent:", user);
      localStorage.setItem("email", email);
      navigate("/auth");
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.email);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const myCode = Math.floor(Math.random() * 1000000000);
        await setDoc(userDocRef, {
          name: user.displayName || "",
          email: user.email,
          userType: "student",
          plan: "free",
          myCode: myCode,
          sets: [],
          cards: [],
        });
      }

      console.log("User signed in with Google:", user);
      localStorage.setItem("email", user.email);
      navigate("/");
    } catch (e) {
      console.error("Error during Google sign-in:", e);

      if (e.code !== "auth/popup-closed-by-user") {
        setError(e.message);
      }
    }
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (!user.emailVerified) {
        await signOut(auth);
        setError("Please verify your email before logging in.");
        return;
      }

      const userDocRef = doc(db, "users", email);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const myCode = Math.floor(Math.random() * 1000000000);
        await setDoc(userDocRef, {
          name: user.displayName || "",
          email: email,
          userType: "student",
          plan: "free",
          myCode: myCode,
          sets: [],
          cards: [],
        });
      }

      console.log("User logged in:", user);
      localStorage.setItem("email", email);
      navigate("/");
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "30px 70px",
        width: "300px",
        height: "fit-content",
        borderRadius: "10px",
        boxShadow: "0px 1px 1px 1px gainsboro",
        marginBottom: "100px",
      }}
    >
      {error && (
        <div
          style={{
            height: "50px",
            width: "300px",
            backgroundColor: "tomato",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            fontSize: "11px",
          }}
        >
          <p>
            Oops! {mode === 1 ? error : "There was a problem with the account!"}
          </p>
        </div>
      )}
      {verificationMessage && (
        <div
          style={{
            height: "50px",
            width: "300px",
            backgroundColor: "lightgreen",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "50px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              textAlign: "center",
              margin: "1px",
            }}
          >
            {verificationMessage}
          </p>
        </div>
      )}
      <h2>Hi! 👋</h2>
      <form onSubmit={handleSubmit}>
        {mode === 0 && (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "20px 0px",
              }}
            >
              <label>Name</label>
              <input
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  outline: "1px solid gainsboro",
                }}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "20px 0px",
          }}
        >
          <label>Your email address</label>
          {mode == 0 && (
            <p style={{ fontSize: "10px", color: "gray" }}>
              A verification email will be sent to this email address
            </p>
          )}
          <input
            style={{
              marginTop: "10px",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              outline: "1px solid gainsboro",
            }}
            type="email"
            placeholder="johndoe07@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "20px 0px",
          }}
        >
          <div style={{ flexDirection: "row", display: "flex" }}>
            <label>Password</label>
            <div style={{ width: "98%" }}></div>
            {mode !== 0 && (
              <button
                type="button"
                style={{
                  fontSize: "12px",
                  color: "orange",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={sendPasswordReset}
              >
                Forgot?
              </button>
            )}
          </div>
          <input
            style={{
              marginTop: "10px",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              outline: "1px solid gainsboro",
            }}
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {mode === 1 ? (
          <button
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "black",
              border: "none",
              color: "white",
              borderRadius: "100px",
              cursor: "pointer",
              marginBottom: "30px",
            }}
            type="submit"
            onClick={login}
          >
            Login
          </button>
        ) : (
          <div>
            <p
              style={{
                fontSize: "10px",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              By signing up, you agree to our{" "}
              <span
                onClick={async () => setPrivacyOpen(true)}
                style={{ color: "blue" }}
              >
                privacy policy
              </span>
              .{privacyOpen && <PrivacyPolicyPopup open={privacyOpen} />}
            </p>
            <button
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "black",
                borderRadius: "100px",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
              type="submit"
              onClick={register}
            >
              Sign Up
            </button>
          </div>
        )}

        <br />
        {/* <p style={{ fontSize: "14px", margin: "10px 0px" }}>or</p> */}
        <hr></hr>
        <br></br>
        <button
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "white",
            outline: "1px solid black",
            border:"none",
            color: "black",
            borderRadius: "200px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={googleSignIn}
        >
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            style={{
              width: "5%",
              height: "5%",
              scale: "2",
              marginRight: "10px",
            }}
          ></img>
          Continue With Google
        </button>

        {mode === 1 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "14px", margin: "30px 10px" }}>
              New to Scroller?
            </p>
            <p
              style={{ fontSize: "14px", cursor: "pointer", color: "orange" }}
              onClick={() => setMode(0)}
            >
              Sign Up
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "14px", margin: "30px 10px" }}>
              Already a member?
            </p>
            <p
              style={{ fontSize: "14px", cursor: "pointer", color: "orange" }}
              onClick={() => setMode(1)}
            >
              Log in
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthBox;
