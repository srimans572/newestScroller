import Bottom from "../components/Bottom";
import CustomDropdown from "../components/Dropdown";
import Navbar from "../components/Navbar";
import Scroller from "../components/Scroller";
import { useState, useEffect, useRef } from "react";
import { doc } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "../components/firebase/Firebase";
import { useNavigate } from "react-router-dom";
import VideoScroller from "../components/VideoScroller";
import HomeScreenTutorial from "../components/mini_components/HomeScreenTutorial";
import ScrollerLogInHomeScreen from "../components/mini_components/ScrollerLogInHomeScreen";

function Scrolls() {
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
  const [announcement, setAnnouncement] = useState(true);

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
            // Get the sets and filter only scrollGenerationMode 1 sets
            const filteredSets = doc
              .data()
              .sets.filter((set) => set.scrollGenerationMode == 2);
            setSets(filteredSets);
            console.log(filteredSets);
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
      style={{ display: "flex", height: "100vh", overflow: "hidden" }}
    >
      {<Navbar setMobileDimension={setMobileDimension} />}
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
            backgroundColor: "whitesmoke",
          }}
        >
          {currentSet ? (
            <div
              style={{
                width: "100%",
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <VideoScroller
                setStreak={setStreak}
                setXP={setXP}
                currentSet={currentSet}
              />
            </div>
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
            <HomeScreenTutorial/>
          )}
          <Bottom
            streak={streak}
            xp={xp}
            sets={sets}
            currentSet={currentSet}
            setCurrentSet={setCurrentSet}
            mobileDimension={mobileDimension}
            location={"videos"}
          />
        </div>
      ) : (
        <ScrollerLogInHomeScreen mobileDimension={mobileDimension}/>
      )}
    </div>
  );
}

export default Scrolls;
