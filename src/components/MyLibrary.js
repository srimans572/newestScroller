import React, { useState, useEffect } from "react";
import NewPrompt from "./NewPrompt";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./firebase/Firebase";

const MyLibrary = ({ mobileDimension }) => {
  const [sets, setSets] = useState([]);
  const [newPrompt, setNewPrompt] = useState("");
  const [openNewTopic, setOpenNewTopic] = useState(false);
  const [style, setStyle] = useState(0); // Manage the style with useState
  const [params, setParams] = useState([]); // Manage the params with useState

  // Updated generateBlob function with dynamic width and height
  const generateBlob = (
    width = 200,
    height = 200,
    amplitude = Math.random() * 50,
    wavelength = Math.random() * 100 + 200,
    offset = Math.random() * 100
  ) => {
    const waveHeight = height / 2;

    let path = `M 0 ${waveHeight}`;
    for (let x = 0; x <= width; x += 10) {
      const y =
        waveHeight +
        amplitude * Math.sin(((x + offset) / wavelength) * 2 * Math.PI);
      path += ` L ${x} ${y}`;
    }

    path += ` L ${width} ${height} L 0 ${height} Z`;
    return path;
  };

  useEffect(() => {
    try {
      const document = onSnapshot(
        doc(db, "users", localStorage.getItem("email")),
        (doc) => {
          setSets(doc.data().sets);
        }
      );
    } catch (error) {
      alert("Error");
    }
  }, []);

  // Function to change style and params when a button is clicked
  const handleNewClick = () => {
    setStyle(0); // Toggle style between 0 and 1
    setParams([]); // Example params
    setOpenNewTopic(!openNewTopic);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: mobileDimension ? "center" : "flex-start",
      }}
    >
      <h1 style={{ margin: "40px 50px" }}>My Library</h1>
      <div
        style={{
          margin: "5px 50px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: mobileDimension ? "center" : "flex-start",
          alignItems: mobileDimension ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            width: "200px",
            height: "200px",
            boxShadow: "0px 0px 16px 1px gainsboro",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            margin: "10px 10px",
          }}
          onClick={() => handleNewClick()}
        >
          <p>Add New Subject</p>
        </div>
        {sets &&
          sets.map((item, index) => (
            <div>
              <div
                key={index}
                style={{
                  width: "200px",
                  height: "200px",
                  boxShadow: `0px 0px 1px 1px ${item.color}`,
                  borderRadius: "10px",
                  display: "flex",
                  cursor: "pointer",
                  margin: "10px 10px",
                  backgroundColor: `${item.color}10`,
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative", // Ensure relative positioning
                }}
                onClick={() => {
                  setStyle(1);
                  setParams([
                    item.color,
                    item.content,
                    item.promptMode,
                    item.subject,
                    item.tag,
                    item.title,
                    item.scrollGenerationMode,
                  ]);
                  setOpenNewTopic(!openNewTopic);
                }}
              >
                <p
                  style={{
                    color: item.color,
                    padding: "10px 10px",
                    fontSize: "24px",
                    fontWeight: "bold",
                    textShadow: `0px 0px 10px ${item.color}90`,
                    whiteSpace: "nowrap", // Prevents text from wrapping
                    overflow: "hidden", // Ensures text does not overflow the container
                    textOverflow: "ellipsis", // Displays ellipsis (...) if the text is too long
                  }}
                >
                  {item.title}
                </p>
                {/* Updated SVG to fit inside the div */}
                <svg
                  width="100%" // Adjust to fit the div's width
                  height="100%" // Adjust to fit the div's height
                  viewBox="0 0 200 200" // Adjust viewbox to match div's dimensions
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    zIndex: -100,
                    borderRadius: 10, // Ensure SVG is behind the text
                  }}
                >
                  <path d={generateBlob(200, 200)} fill={`${item.color}19`} />
                </svg>
                <p
                  style={{
                    margin: "10px 10px",
                    color: `${item.color}`,
                    background: `${item.color}10`,
                    boxShadow: `0px 0px 10px 1px ${item.color}38`,
                    padding: "5px 10px",
                    borderRadius: "100px",
                  }}
                >
                  Mode:{" "}
                  {item.scrollGenerationMode != 2 ? "Questions" : "Videos"}
                </p>
              </div>
            </div>
          ))}
      </div>

      {openNewTopic && (
        <NewPrompt
          setOpenNewTopic={setOpenNewTopic}
          style={style}
          params={params}
        />
      )}
    </div>
  );
};

export default MyLibrary;
