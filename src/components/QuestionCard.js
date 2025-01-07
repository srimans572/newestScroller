import React, { useState, useEffect } from "react";
import "../index.css";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import correct from "../assets/correct-answer-sound-effect-19.wav";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; // Import necessary Firebase methods
import { db } from "./firebase/Firebase";
import Comments from "./mini_components/Comments";
var randomColor = require("randomcolor"); // import the script
const QuestionCard = ({
  question,
  choices,
  answer,
  comment,
  setStreak,
  selectedAnswer,
  setXP,
  title,
  color,
  fullJSON,
  isFavorites,
  mobileDimension,
}) => {
  const cardStyle = {
    cardColor: "whitesmoke",
    textColor: "black",
    buttonColor: "whitesmoke",
  };
  const [selectedChoice, setSelectedChoice] = useState(selectedAnswer);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showPlus10, setShowPlus10] = useState(false);
  const [shake, setShake] = useState(false);

  // New state to handle comment tab visibility
  const [showComments, setShowComments] = useState(false);

  // Retrieve favorites from local storage, or initialize with an empty array
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  useEffect(() => {
    // Update local storage whenever favorites change
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const formatBoldText = (text) => {
    try {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <b style={{}} key={index}>
              <Latex>{part.slice(2, -2)}</Latex>
            </b>
          );
        }
        return <Latex key={index}>{part}</Latex>;
      });
    } catch {}
  };

  const handleChoiceClick = (choice) => {
    if (isAnswered) return;
    setSelectedChoice(choice);
    setIsAnswered(true);
    if (choice === parseInt(answer)) {
      setStreak((prevStreak) => prevStreak + 1);
      setXP((prevXP) => prevXP + 10);
      triggerPlus10Animation();
    } else {
      setStreak(0);
      triggerShakeAnimation();
    }
  };

  const triggerPlus10Animation = () => {
    setShowPlus10(true);
    setTimeout(() => {
      setShowPlus10(false);
    }, 1500);
  };

  const triggerShakeAnimation = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 500);
  };

  const handleHeartClick = async () => {
    const existingFavorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    const userEmail = localStorage.getItem("email"); // Get the user's email
    const userDocRef = doc(db, "users", userEmail); // Reference to the user's document in Firebase

    try {
      if (existingFavorites.some((fav) => fav.question === fullJSON.question)) {
        // Remove from favorites in local storage
        const updatedFavorites = existingFavorites.filter(
          (fav) => fav.question !== fullJSON.question
        );
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

        // Remove the fullJSON object from the 'cards' field in Firebase
        await updateDoc(userDocRef, {
          cards: arrayRemove(fullJSON),
        });
      } else {
        const newJSON = {
          question,
          choices,
          answer,
          setStreak,
          selectedAnswer,
          setXP,
          title,
          color,
          fullJSON,
        };

        // Add to favorites in local storage
        const updatedFavorites = [...existingFavorites, newJSON];
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

        // Add the fullJSON object to the 'cards' field in Firebase
        await updateDoc(userDocRef, {
          cards: arrayUnion(fullJSON),
        });
      }
    } catch (error) {
      console.error("Error updating favorites: ", error);
      alert("Error updating favorites.");
    }
  };

  const isFavorite = favorites.some(
    (fav) => fav.question === fullJSON.question
  );

  return (
    <div>
      <div
        className="card"
        style={{
          background: `${color}08`,
          borderRadius: "10px",
          boxShadow: `0px 0px 20px 1px ${color}20`,
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // Ensures content stays at the top
          position: "relative",
          animation: shake ? "shake 0.5s ease-out" : "none",
          border: `1px solid ${color}80`,
          transition: "transform 0.3s ease-in-out",
          minHeight: "300px", // Ensures the card has enough space to work with
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: `${color}20`,
              margin: "-10px",
              padding: "10px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <p
              style={{
                margin: "0px",
                color: color,
                backgroundColor: `${color}08`,
                padding: "1px 15px",
                outline: `1px solid ${color}`,
                borderRadius: "100px",
                width: "fit-content",
              }}
            >
              {title}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {!isFavorites && (
                <i
                  onClick={handleHeartClick}
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    color: `${color}30`,
                  }}
                  className="fa-solid fa-heart"
                  id={isFavorite ? "heart-clicked" : "heart-unclicked"}
                ></i>
              )}
              <svg
                onClick={async () => setShowComments(!showComments)}
                style={{ cursor: "pointer" }}
                fill={`${color}80`}
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="cls-1"
                  d="M21.5,12A9.5,9.5,0,1,0,12,21.5h9.5l-2.66-2.92A9.43,9.43,0,0,0,21.5,12Z"
                />
              </svg>
            </div>
          </div>
          <p
            style={{
              fontSize:
                question.length < 150
                  ? "24px"
                  : question.length < 400
                  ? "18px"
                  : "14px",
              marginTop: "20px",
              color: cardStyle.textColor,
              lineHeight: "1.2",
            }}
          >
            {formatBoldText(question)}
          </p>
        </div>
        {showComments&&<Comments comment={comment} randomColor={randomColor} formatBoldText={formatBoldText} />}
        {/* Choices */}
        <div style={{ marginTop: "auto" }}>
          {choices.map((choice, index) => (
            <button
              className="cardButton"
              key={index}
              style={{
                display: "block",
                width: "100%",
                border: "1px solid gainsboro",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "10px",
                textAlign: "left",
                boxShadow: "none",
                fontSize: choice.length > 60 && "10px",
                cursor: isAnswered || isFavorites ? "not-allowed" : "pointer",
                backgroundColor: !isFavorites
                  ? selectedChoice === index
                    ? selectedChoice === parseInt(answer)
                      ? "palegreen"
                      : "salmon"
                    : isAnswered && choice === parseInt(answer)
                    ? "palegreen"
                    : cardStyle.buttonColor
                  : choice == parseInt(answer)
                  ? "palegreen"
                  : "salmon",
                opacity: isAnswered && selectedChoice !== index ? 0.6 : 1,
                color: cardStyle.textColor,
              }}
              disabled={isFavorites}
              onClick={() => {
                handleChoiceClick(index);
              }}
            >
              <Latex>{choice}</Latex>
            </button>
          ))}
        </div>

        {showPlus10 && <div className="plus10-animation">+10</div>}
      </div>
    </div>
  );
};

export default QuestionCard;
