import React, { useState, useEffect } from "react";
import NewPrompt from "./NewPrompt";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./firebase/Firebase";
import { getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, signInWithGoogle, logOut } from "./firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";

var randomColor = require("randomcolor"); // import the script

const FeaturedSets = ({ mobileDimension }) => {
  const [isVisible, setIsVisible] = useState(window.innerWidth > 1100);
  const [sets, setSets] = useState([]);
  const [newPrompt, setNewPrompt] = useState("");
  const [openNewTopic, setOpenNewTopic] = useState(false);
  const [style, setStyle] = useState(0); // Manage the style with useState
  const [params, setParams] = useState([]); // Manage the params with useState
  const [currentsets, setCurrentSets] = useState([]);
  const [selected, setSelected] = useState("Community Sets");
  const [filteredSets, setFilteredSets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState("rishit.agrawal121@gmail.com");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth > 1100);
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(doc(db, "sets", "featured"), (doc) => {
        const data = doc.data();
        setSets(data?.sets || []); // Default to an empty array if no sets are found
      });

      return () => unsubscribe(); // Cleanup listener on unmount
    } catch (error) {
      alert("Error fetching sets");
    }
  }, []);

  useEffect(() => {
    try {
      const document = onSnapshot(doc(db, "users", user), (doc) => {
        setCurrentSets(doc.data().sets);
      });
    } catch (error) {
      alert("Error");
    }
  }, [user]);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser.email);
      setLoading(false); // Auth state resolved
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);
  // Function to handle the "My Sets" filtering
  const filterMySets = () => {
    const userEmail = user;
    const mySets = sets.filter((item) => item.author === userEmail);
    setFilteredSets(mySets);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleClick = (text) => {
    setSelected(text);

    if (text === "My Sets") {
      filterMySets();
    }
  };

  const getStyle = (text) => ({
    display: "flex",
    width: text === "Community Sets" ? "140px" : "100px",
    justifyContent: text === "My Sets" ? "center" : "flex-start",
    alignItems: "center",
    fontWeight: selected === text ? "bold" : "normal",
    position: "relative", // Needed for the underline
    cursor: "pointer",
  });

  const isSetAdded = (title) => {
    console.log(currentsets);
    console.log(title);
    return currentsets.some((set) => set.title === title);
  };
  console.log(isSetAdded("Astronomy"));
  // Updated generateBlob function with dynamic width and height

  const saveToFirestore = async (title, content, subject, promptMode, tag) => {
    try {
      const color = randomColor({
        luminosity: "dark",
      });
      const selectedMode = 1;
      const userEmail = user;
      const docRef = doc(db, "users", userEmail);
      // Fetch the current data from Firestore
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error("Document not found");
        return;
      }
      let currentSets = docSnap.data().sets || [];
      // Check if the title already exists in currentSets
      const isDuplicate = currentSets.some((set) => set.title === title);
      if (isDuplicate) {
        window.alert("This set already exists in your library!");
        return; // Exit early if duplicate
      }
      // Add the new set
      const newSet = {
        title: title,
        content: content,
        subject: subject,
        promptMode: promptMode,
        color: color,
        tag: tag,
        scrollGenerationMode: selectedMode,
      };
      currentSets.push(newSet);

      // Update Firestore
      await updateDoc(docRef, { sets: currentSets });
      updateFeaturedSetTimesAdded(title)
    
      console.log("Set added successfully!");
    } catch (e) {
      console.error("Error adding set:", e);
    }
  };

  const updateFeaturedSetTimesAdded = async (title) => {
    try {
      const docRef = doc(db, "sets", "featured");
  
      // Fetch the current data from Firestore
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error("Featured document not found");
        return;
      }
  
      // Retrieve the current "sets" array
      let currentSets = docSnap.data().sets || [];
  
      // Find the index of the set with the matching title
      const setIndex = currentSets.findIndex((set) => set.Title === title);
      if (setIndex === -1) {
        console.error("Set not found in featured sets");
        return;
      }
  
      // Increment the "times_added" field for the correct set
      currentSets[setIndex].times_added =
        (currentSets[setIndex].times_added || 0) + 1;
  
      // Update Firestore with the modified array
      await updateDoc(docRef, { sets: currentSets });
  
      console.log(`Updated "times_added" for set with title: ${title}`);
    } catch (e) {
      console.error("Error updating featured set:", e);
    }
  };

  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: mobileDimension ? "center" : "flex-start",
      }}
    >
      <input
        type="text"
        placeholder="Search for community sets"
        style={{
          outline: "1px solid gainsboro",
          border: "none",
          borderRadius: "10px",
          padding: "10px 20px",
          width: "500px",
          boxSizing: "border-box",
          margin: "0px 50px",
          fontWeight: "500",
        }}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        {searchQuery && (
          <p style={{ margin: "20px 70px", fontSize: "18px" }}>
            Results for "{`${searchQuery}`}"
          </p>
        )}
        {isVisible && (
          <div
            style={{
              position: "absolute",
              right: "20px", // Adjust this value for spacing from the screen edge
              top: "10px", // Align with the title
              padding: "10px 15px",
              width: "30%",
              height: "5%",
            }}
          >
            {/*<button
              style={{
                borderRadius: "10px",
                backgroundColor: "#FF8C00",
                position: "absolute",
                right: "88%",
                width: "50px",
                height: "50px",
                justifyContent: "center",
                alignItems: "center",
                border: "none", // Removed outline
                cursor: "pointer", // Optional: for better UX
                color: "white", // Text color
                fontSize: "30px", // Size of "+"
              }}
              onClick={handleNewClick}
            >
              +
            </button>*/}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "20px 70px",
          width: "300px",
        }}
      >
        <p
          style={getStyle("Community Sets")}
          onClick={() => handleClick("Community Sets")}
        >
          Community Sets
          {selected === "Community Sets" && (
            <span
              style={{
                position: "absolute",
                bottom: "-4px", // Adjust the vertical position of the underline
                left: "0",
                width: "100%",
                height: "3px", // Thickness of the underline
                backgroundColor: "black", // Color of the underline
                borderRadius: "2px",
                fontSize: "16px",
              }}
            ></span>
          )}
        </p>
        <div style={{ display: "flex", width: "30px" }}></div>
        <p style={getStyle("My Sets")} onClick={() => handleClick("My Sets")}>
          My Sets
          {selected === "My Sets" && (
            <span
              style={{
                position: "absolute",
                bottom: "-4px", // Adjust the vertical position of the underline
                left: "0",
                width: "100%",
                height: "3px", // Thickness of the underline
                backgroundColor: "black", // Color of the underline
                borderRadius: "2px",
                fontSize: "16px",
              }}
            ></span>
          )}
        </p>
      </div>
      <div
        style={{
          margin: "25px 60px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: mobileDimension ? "center" : "flex-start",
          alignItems: mobileDimension ? "center" : "flex-start",
        }}
      >
        {Array.isArray(sets) &&
          sets
            .filter((item) => {
              // Filter based on selected sets (My Sets or Community Sets)
              const isMySet =
                selected === "My Sets" ? item.author === user : true;

              // Filter based on search query (matching title or content)
              const isSearchMatch = item.Title.toLowerCase().includes(
                searchQuery.toLowerCase()
              );
              //   item.content.toLowerCase().includes(searchQuery.toLowerCase());

              return isMySet && isSearchMatch;
            })
            .map((item, index) => (
              <div>
                <div
                  onClick={() => saveToFirestore(item.Title, "", "", 3, 'fa-solid fa-calculator')} // Fix here
                  className="featuredCards"
                  key={index}
                  style={{
                    width: "320px",
                    height: "200px",
                    borderRadius: "10px",
                    display: "flex",
                    margin: "10px 10px",
                    backgroundColor: `${item.color}10`,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "400px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: item.color,
                          padding: "10px 10px",
                          display: "flex",
                          width: "300px",
                          flexDirection: "column",
                          fontSize: "18px",
                          whiteSpace: "nowrap", // Prevents text from wrapping
                          overflow: "hidden", // Ensures text does not overflow the container
                          textOverflow: "ellipsis", // Displays ellipsis (...) if the text is too long
                        }}
                      >
                        {item.Title.slice(0, 12)}
                      </p>
                      <p
                        style={{
                          margin: "10px",
                          outline: `${item.color} 1px solid`,
                          padding: "3px 5px",
                          fontSize: "12px",
                          width: "fit-content",
                          borderRadius: "100px",
                        }}
                      >
                        Added by {item.times_added>0?item.times_added:0} student(s)
                      </p>
                    </div>
                  </div>
                  <div style={{ margin: "10px", display: "flex" }}>
                    <p
                      style={{
                        width: "25px",
                        height: "25px",
                        backgroundColor: `${item.color}`,
                        borderRadius: "100px",
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                        marginRight: "10px",
                      }}
                    >
                      {item.author?.slice(0, 1)}
                    </p>
                    <p>{item.author}</p>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {openNewTopic && (
        <NewPrompt
          setOpenNewTopic={setOpenNewTopic}
          style={style}
          params={params}
          type={3}
        />
      )}
    </div>
  );
};
export default FeaturedSets;
