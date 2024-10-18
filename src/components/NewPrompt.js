import React, { useEffect, useState } from "react";
import { db } from "./firebase/Firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import Tesseract from "tesseract.js";
// Set up the PDF worker
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import PDFJSWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

var randomColor = require("randomcolor"); // import the script

function NewPrompt({ setOpenNewTopic, style, params }) {
  const [promptMode, setPromptMode] = useState(1);
  const [subcolor, subcontent, subpromptmode, subsubject, subtag, subtitle, subselectedmode] =
    params;
  const [selectedMode, setSelectedMode] = useState(1);
  const [title, setTitle] = useState(style === 1 ? subtitle : "");
  const [content, setContent] = useState(style === 1 ? subcontent : "");
  const [subject, setSubject] = useState(style === 1 ? subsubject : "");
  const [tag, setTage] = useState("fa-solid fa-calculator");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  function handleFile(event) {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        // Handle PDF file
        const fileUrl = URL.createObjectURL(file);
        setPdfUrl(fileUrl);
        extractTextFromPdf(file);
      } else if (file.type.startsWith("image/")) {
        // Handle image file
        const fileUrl = URL.createObjectURL(file);
        setImageUrl(fileUrl);
        extractTextFromImage(file);
      } else {
        alert("Please upload a valid PDF or image file.");
      }
    }
  }
  function extractTextFromImage(file) {
    Tesseract.recognize(
      file,
      "eng", // Language
      {
        logger: (info) => console.log(info), // Optional: for logging progress
      }
    )
      .then(({ data: { text } }) => {
        setContent(text);
      })
      .catch((error) => {
        console.error("Error recognizing text from image:", error);
      });
  }
  function extractTextFromPdf(file) {
    const fileReader = new FileReader();

    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);

      try {
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const numPages = pdf.numPages;
        let fullText = "";

        // Function to extract text from each page
        const extractTextFromPage = async (pageNum) => {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          fullText += pageText + "\n";

          if (pageNum < numPages) {
            extractTextFromPage(pageNum + 1);
          } else {
            setContent(fullText);
          }
        };

        extractTextFromPage(1);
      } catch (error) {
        console.error("Error loading PDF document:", error);
      }
    };

    fileReader.readAsArrayBuffer(file);
  }

  const removeItemFromLocalStorage = (itemToDelete) => {
    // Retrieve the current set from localStorage
    const currentSet = JSON.parse(localStorage.getItem("currentSet"));

    // Check if the current set matches the item to delete
    if (
      currentSet.title === itemToDelete.title &&
      currentSet.content === itemToDelete.content &&
      currentSet.subject === itemToDelete.subject &&
      currentSet.promptMode === itemToDelete.promptMode &&
      currentSet.scrollGenerationMode == itemToDelete.scrollGenerationMode &&
      // currentSet.color === itemToDelete.color &&
      currentSet.tag === itemToDelete.tag
    ) {
      // Remove the item by setting it to null or an empty object/string
      localStorage.removeItem("currentSet");
      console.log("Item removed from localStorage");
    } else {
      console.log("Item not found in localStorage");
    }
  };

  const deleteItemFromFirestore = async () => {
    try {
      const userEmail = localStorage.getItem("email");
      const docRef = doc(db, "users", userEmail);

      // Fetch the current data from Firestore
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error("Document not found");
        return;
      }

      // Get the current sets array
      let currentSets = docSnap.data().sets || [];

      // Filter out the item to be deleted
      currentSets = currentSets.filter(
        (item) =>
          !(
            item.title === subtitle &&
            item.content === subcontent &&
            item.subject === subsubject &&
            item.promptMode === subpromptmode &&
            item.scrollGenerationMode == subselectedmode &&
            item.color === subcolor &&
            item.tag === subtag
          )
      );

      // Update the Firestore document with the modified sets array
      await updateDoc(docRef, { sets: currentSets });

      // Remove from localStorage if necessary
      const currentSet = JSON.parse(localStorage.getItem("currentSet"));
      if (currentSet && currentSet.title === subtitle) {
        localStorage.removeItem("currentSet");
      }

      console.log("Item deleted successfully");
      setOpenNewTopic(false);
    } catch (e) {
      console.error("Error deleting item:", e);
      setOpenNewTopic(false);
    }
  };

  const saveToFirestore = async () => {
    try {
      const color = randomColor({
        luminosity: 'dark',
      });
      const userEmail = localStorage.getItem("email");
      const docRef = doc(db, "users", userEmail);
      // Fetch the current data from Firestore
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error("Document not found");
        return;
      }
      let currentSets = docSnap.data().sets || [];
      if (style === 1) {
        // Remove the item if style === 1
        currentSets = currentSets.filter(
          (item) =>
            !(
              item.title === subtitle &&
              item.content === subcontent &&
              item.subject === subsubject &&
              item.promptMode === subpromptmode &&
              item.scrollGenerationMode == subselectedmode &&
              item.color === subcolor &&
              item.tag === subtag
            )
        );
        // Wrap the removeItemFromLocalStorage call in a try-catch block
        try {
          removeItemFromLocalStorage({
            title: subtitle,
            content: subcontent,
            subject: subsubject,
            promptMode: subpromptmode,
            scrollGenerationMode: subselectedmode,
            color: subcolor,
            tag: subtag,
          });
        } catch (removeError) {
          console.error("Error removing item from localStorage:", removeError);
        }
        // Add the new item at the same index
        const index = docSnap
          .data()
          .sets.findIndex(
            (item) =>
              item.title === subtitle &&
              item.content === subcontent &&
              item.subject === subsubject &&
              item.promptMode === subpromptmode &&
              item.color === subcolor &&
              item.scrollGenerationMode == subselectedmode &&
              item.tag === subtag
          );
        if (index !== -1) {
          currentSets.splice(index, 0, {
            title: title,
            content: content,
            subject: subject,
            promptMode: promptMode,
            color: subcolor,
            tag: tag,
            scrollGenerationMode: selectedMode,
          });
          console.log("hi");
        } else {
          // If item was not found, just add to the end
          currentSets.push({
            title: title,
            content: content,
            subject: subject,
            promptMode: promptMode,
            color: subcolor,
            tag: tag,
            scrollGenerationMode: selectedMode,
          });
        }
      } else {
        // If style !== 1, just add to the end
        currentSets.push({
          title: title,
          content: content,
          subject: subject,
          promptMode: promptMode,
          color: color,
          tag: tag,
          scrollGenerationMode: selectedMode,
        });
      }

      // Update the Firestore document
      await updateDoc(docRef, { sets: currentSets });

      // Update localStorage
      if (localStorage.getItem("currentSet")==null||localStorage.getItem("currentSet")==undefined) {
        localStorage.setItem(
          "currentSet",
          JSON.stringify({
            title: title,
            content: content,
            subject: subject,
            promptMode: promptMode,
            color: subcolor,
            tag: tag,
            scrollGenerationMode: selectedMode,
          })
        );
      } 

      setOpenNewTopic(false);
    } catch (e) {
      console.error(e);
      setOpenNewTopic(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleModeClick = (mode) => {
    setSelectedMode(mode);
  };

  const getModeStyle = (mode) => ({
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    margin: "0px 5px",
    borderRadius: "8px",
    backgroundColor: selectedMode === mode ? "#f1f1f1" : "white",
    boxShadow: selectedMode === mode ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
    transform: selectedMode === mode ? "scale(0.98)" : "scale(1)",
    outline: selectedMode === mode ? "1px solid black" : "1px solid gainsboro",
    transition: "all 0.2s ease",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <div
      style={{
        flexDirection: "column",
        width: "350px",
        height: "90vh",
        position: "absolute",
        right: "1%",
        zIndex: "9999",
        top: "20px",
        background: "white",
        boxShadow: "0px 0px 16px 1px gainsboro",
        borderRadius: "10px",
        display: "flex",
        padding: "20px",
        justifyContent: "space-between",
      }}
    >
      <svg
        onClick={async () => {
          setOpenNewTopic(false);
        }}
        xmlns="http://www.w3.org/2000/svg"
        fill="gainsboro"
        viewBox="0 0 384 512"
        style={{
          position: "absolute",
          height: "20px",
          right: "10px",
          top: "10px",
          cursor: "pointer",
        }}
      >
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
      <div style={{ display: "flex" }}>
        <div
          onClick={() => setPromptMode(1)}
          style={{
            borderBottom:
              promptMode === 1 ? "1px solid black" : "1px solid gainsboro",
            marginRight: "10px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          <p style={{ margin: "0px" }}>My content</p>
        </div>
        <div
          onClick={() => setPromptMode(2)}
          style={{
            borderBottom:
              promptMode === 2 ? "1px solid black" : "1px solid gainsboro",
            marginRight: "10px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          <p style={{ margin: "0px" }}>From scratch</p>
        </div>
      </div>
      <div>
        <div style={{ width: "100%", marginBottom: "10px" }}>
          <p style={{ fontSize: "20px", margin: "0px" }}>Title</p>
          <p style={{ margin: "4px 0px", fontSize: "12px", color: "gray" }}>
            Set a title for your AI generated scrolls, so it's easy to access
            later.
          </p>
          <input
            value={title}
            onChange={handleTitleChange}
            style={{
              outline: "1px solid gainsboro",
              border: "none",
              borderRadius: "10px",
              padding: "10px 5px",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>
        {promptMode === 1 ? (
          <div style={{ width: "100%", marginBottom: "10px" }}>
            <p style={{ fontSize: "20px", margin: "0px" }}>Content</p>
            <p style={{ margin: "4px 0px", fontSize: "12px", color: "gray" }}>
              Copy and paste your notes, lectures or any other textual content.
            </p>
            <div
              style={{
                outline: "1px solid gainsboro",
                border: "none",
                borderRadius: "10px",
                width: "100%",
                boxSizing: "border-box",
                height: "35vh",
                position: "relative",
              }}
            >
              <textarea
                value={content}
                onChange={handleContentChange}
                style={{
                  outline: "none",
                  border: "none",
                  borderRadius: "10px",
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "none",
                  padding: "10px",
                  height: "90%",
                }}
                maxLength={10000}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p
                  style={{
                    textAlign: "end",
                    fontSize: "12px",
                    color: "gray",
                    padding: "0px 10px",
                  }}
                >
                  {content.length}/10000
                </p>
                <form
                  style={{ position: "absolute", bottom: "5px", left: "5px" }}
                >
                  <label
                    htmlFor="fileUpload"
                    style={{
                      background: "white",
                      display: "inline-block",
                      padding: "5px 8px", // Reduced padding
                      borderRadius: "8px", // Reduced border radius
                      outline: "1px solid gainsboro",
                      cursor: "pointer",
                      backgroundColor: "white",
                      fontSize: "12px", // Reduced font size
                      color: "black",
                      textAlign: "center",
                      boxSizing: "border-box",
                      boxShadow: "2px 2px 5px gainsboro", // Shadow added here
                    }}
                  >
                    Upload Notes
                    <input
                      id="fileUpload"
                      type="file"
                      name="file"
                      accept=".pdf, image/*" // Accepts PDF files and all image formats
                      onChange={handleFile}
                      style={{ display: "none" }}
                    />
                  </label>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "20px", margin: "0px" }}>Content</p>
            <p style={{ margin: "4px 0px", fontSize: "12px", color: "gray" }}>
              Copy and paste your notes, lectures or any other textual content.
            </p>
            <div
              style={{
                outline: "1px solid gainsboro",
                border: "none",
                borderRadius: "10px",
                width: "100%",
                boxSizing: "border-box",
                height: "35vh",
                position: "relative",
                marginBottom: "10px",
              }}
            >
              <textarea
                value={subject}
                onChange={handleSubjectChange}
                style={{
                  outline: "none",
                  border: "none",
                  borderRadius: "10px",
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "none",
                  padding: "10px",
                  height: "90%",
                }}
                placeholder="Chain rule for AP Calculus BC..."
                maxLength={6000}
              />
              <p
                style={{
                  textAlign: "end",
                  fontSize: "12px",
                  color: "gray",
                  padding: "0px 10px",
                }}
              >
                {subject.length}/6000
              </p>
              <form
                style={{ position: "absolute", bottom: "5px", left: "5px" }}
              >
                <label
                  htmlFor="fileUpload"
                  style={{
                    background: "white",
                    display: "inline-block",
                    padding: "5px 8px", // Reduced padding
                    borderRadius: "8px", // Reduced border radius
                    outline: "1px solid gainsboro",
                    cursor: "pointer",
                    backgroundColor: "white",
                    fontSize: "12px", // Reduced font size
                    color: "black",
                    textAlign: "center",
                    boxSizing: "border-box",
                    boxShadow: "2px 2px 5px gainsboro", // Shadow added here
                  }}
                >
                  Upload Notes
                  <input
                    id="fileUpload"
                    type="file"
                    name="file"
                    accept=".pdf, image/*" // Accepts PDF files and all image formats
                    onChange={handleFile}
                    style={{ display: "none" }}
                  />
                </label>
              </form>
            </div>
          </div>
        )}

        <div style={{ width: "100%", marginBottom: "10px" }}>
          <p style={{ fontSize: "20px", margin: "0px" }}>Mode</p>
          <p style={{ margin: "4px 0px", fontSize: "12px", color: "gray" }}>
            Choose how you want to study!
          </p>
          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <div style={getModeStyle(1)} onClick={() => handleModeClick(1)}>
              📖 Questions
            </div>
            <div style={getModeStyle(2)} onClick={() => handleModeClick(2)}>
              📹 Videos
            </div>
          </div>
        </div>
      </div>

      <div>
        {style === 0 && (
          <button
            onClick={() => saveToFirestore(false)}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px solid gainsboro",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        )}
        {style === 1 && (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              onClick={() => saveToFirestore(false)}
              style={{
                width: "47%",
                background: "transparent",
                border: "1px solid gainsboro",
                padding: "10px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <div style={{ width: "6%" }}></div>
            <button
              onClick={() => deleteItemFromFirestore()}
              style={{
                width: "47%",
                background: "transparent",
                border: "1px solid gainsboro",
                padding: "10px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {
        <div
          onClick={() => setOpenNewTopic(false)}
          style={{ position: "absolute", right: "30px", cursor: "pointer" }}
        ></div>
      }
    </div>
  );
}

export default NewPrompt;
