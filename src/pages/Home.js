import Bottom from "../components/Bottom";
import CustomDropdown from "../components/Dropdown";
import Navbar from "../components/Navbar";
import Scroller from "../components/Scroller";
import { useState, useEffect } from "react";
import { doc } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "../components/firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {
  const [streak, setStreak] = useState(
    localStorage.getItem("streak")
      ? parseInt(localStorage.getItem("streak"))
      : 0
  );
  const [xp, setXP] = useState(
    localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0
  );
  const [sets, setSets] = useState();
  const [currentSet, setCurrentSet] = useState(
    localStorage.getItem("currentSet")
      ? JSON.parse(localStorage.getItem("currentSet"))
      : null
  );
  const navigate = useNavigate();
  const [mobileDimension, setMobileDimension] = useState(false);

  useEffect(() => {
    console.log(sets);
  });

  useEffect(() => {
    localStorage.setItem("streak", streak);
    localStorage.setItem("xp", xp);
    localStorage.setItem("sets", JSON.stringify(sets));
  }, [streak, xp, sets]);

  useEffect(() => {
    try {
      if (localStorage.getItem("email")) {
        const document = onSnapshot(
          doc(db, "users", localStorage.getItem("email")),
          (doc) => {
            setSets(doc.data().sets);
            console.log(sets);
          }
        );
      }
    } catch (error) {
      alert("Error");
    }
  }, []);

  return (
    <div
      className="App"
      style={{ display: "flex", height: "100vh", overflow: "hidden",}}
    >
      <Navbar setMobileDimension={setMobileDimension} />
      {localStorage.getItem("email") ? (
        <div
          style={{
            flex: 1,
            padding: "10px",
            overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor:"whitesmoke"
          }}
        >
          {currentSet ? (
            <Scroller
              setStreak={setStreak}
              setXP={setXP}
              currentSet={currentSet}
            />
          ) : (sets && sets.length) > 0 && !currentSet ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p style={{}}>Pick a subject to get started with your session!</p>
            </div>
          ) : (
            <p style={{ textAlign: "center", width: "50%" }}>
              Welcome to Scroller! To get started, add a new subject in{" "}
              <span>
                <svg
                  fill="#000000"
                  width="20px"
                  height="20px"
                  viewBox="0 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{margin:"0px 10px"}}
                >
                  <path d="M30.156 26.492l-6.211-23.184c-0.327-1.183-1.393-2.037-2.659-2.037-0.252 0-0.495 0.034-0.727 0.097l0.019-0.004-2.897 0.776c-0.325 0.094-0.609 0.236-0.86 0.42l0.008-0.005c-0.49-0.787-1.349-1.303-2.33-1.306h-2.998c-0.789 0.001-1.5 0.337-1.998 0.873l-0.002 0.002c-0.5-0.537-1.211-0.873-2-0.874h-3c-1.518 0.002-2.748 1.232-2.75 2.75v24c0.002 1.518 1.232 2.748 2.75 2.75h3c0.789-0.002 1.5-0.337 1.998-0.873l0.002-0.002c0.5 0.538 1.211 0.873 2 0.875h2.998c1.518-0.002 2.748-1.232 2.75-2.75v-16.848l4.699 17.54c0.327 1.182 1.392 2.035 2.656 2.037h0c0.001 0 0.003 0 0.005 0 0.251 0 0.494-0.034 0.725-0.098l-0.019 0.005 2.898-0.775c1.182-0.326 2.036-1.392 2.036-2.657 0-0.252-0.034-0.497-0.098-0.729l0.005 0.019zM18.415 9.708l5.31-1.423 3.753 14.007-5.311 1.422zM18.068 3.59l2.896-0.776c0.097-0.027 0.209-0.043 0.325-0.043 0.575 0 1.059 0.389 1.204 0.918l0.002 0.009 0.841 3.139-5.311 1.423-0.778-2.905v-1.055c0.153-0.347 0.449-0.607 0.812-0.708l0.009-0.002zM11.5 2.75h2.998c0.69 0.001 1.249 0.56 1.25 1.25v3.249l-5.498 0.001v-3.25c0.001-0.69 0.56-1.249 1.25-1.25h0zM8.75 23.25h-5.5v-14.5l5.5-0.001zM10.25 8.75l5.498-0.001v14.501h-5.498zM4.5 2.75h3c0.69 0.001 1.249 0.56 1.25 1.25v3.249l-5.5 0.001v-3.25c0.001-0.69 0.56-1.249 1.25-1.25h0zM7.5 29.25h-3c-0.69-0.001-1.249-0.56-1.25-1.25v-3.25h5.5v3.25c-0.001 0.69-0.56 1.249-1.25 1.25h-0zM14.498 29.25h-2.998c-0.69-0.001-1.249-0.56-1.25-1.25v-3.25h5.498v3.25c-0.001 0.69-0.56 1.249-1.25 1.25h-0zM28.58 27.826c-0.164 0.285-0.43 0.495-0.747 0.582l-0.009 0.002-2.898 0.775c-0.096 0.026-0.206 0.041-0.319 0.041-0.575 0-1.060-0.387-1.208-0.915l-0.002-0.009-0.841-3.14 5.311-1.422 0.841 3.14c0.027 0.096 0.042 0.207 0.042 0.321 0 0.23-0.063 0.446-0.173 0.63l0.003-0.006z"></path>
                </svg>
                My Library
              </span>
            </p>
          )}
          <Bottom
            streak={streak}
            xp={xp}
            sets={sets}
            currentSet={currentSet}
            setCurrentSet={setCurrentSet}
            mobileDimension={mobileDimension}
          />
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: mobileDimension?"translate(-50%, -50%)":"translate(0%, -50%)",
          }}
        >
          <p style={{fontSize:"21px"}}>Hey 👋, welcome to{" "}</p>
          <h1
            style={{
              margin: "0px",
              textShadow: "2px 2px 5px orange",
              fontSize: "50px",
            }}
          >
            Scro<span style={{fontStyle:"italic"}}>ll</span>er
          </h1>
          <br></br>
          <button
            onClick={async () => navigate("/auth")}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "black",
              border: "none",
              color: "white",
              borderRadius: "100px",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            to get scrollin'!
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
