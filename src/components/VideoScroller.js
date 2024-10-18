import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100%",
  overflowY: "auto", // Change from 'scroll' to 'auto'
  scrollSnapType: "y mandatory", // Enforce snapping on the y-axis
  scrollBehavior: "smooth", // Smooth scrolling
  boxSizing: "border-box",
  padding: "0px",
  margin: "0px",
  alignItems: "center",
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh", // Each card takes up full viewport height
  scrollSnapAlign: "start", // Snap to the start of each card
  scrollSnapStop: "always", // Stop scrolling at each snap point
};

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontSize: "24px",
  color: "#888",
};

const Card = ({
  data,
  color,
  setIsSpeakingGlobal,
  voicesLoaded,
  isSpeakingGlobal,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const cardKey = Object.keys(data)[0]; // Dynamically get the first key (card1, card2, etc.)
  const cardData = data[cardKey]; // Access the array inside that key

  useEffect(() => {
    if (!isSpeaking || !voicesLoaded) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const currentText = cardData[currentTextIndex].text;
    const utterance = new SpeechSynthesisUtterance(currentText);

    // Set a male voice (assuming it's available at index 1, adjust as needed)
    utterance.voice = window.speechSynthesis.getVoices()[1];

    synth.speak(utterance);
    setIsZooming(true);
    setIsSpeakingGlobal(true);

    utterance.onend = () => {
      if (currentTextIndex < cardData.length - 1) {
        setCurrentTextIndex((prevIndex) => prevIndex + 1);
      } else {
        setIsFinished(true);
        setIsSpeaking(false);
        setIsSpeakingGlobal(false);
        setIsZooming(false);
      }
    };

    return () => {
      synth.cancel();
      setIsZooming(false);
      setIsSpeakingGlobal(false);
    };
  }, [currentTextIndex, voicesLoaded, isSpeaking]);

  const handleStartSpeaking = () => {
    if (isFinished) {
      setCurrentTextIndex(0);
      setIsFinished(false);
    }
    setIsSpeaking(true);
  };

  return (
    <div
      className="videoCard"
      style={{
        borderRadius: "10px",
        boxShadow: `0px 0px 20px 1px ${color}20`,
        padding: "10px",
        border: `1px solid ${color}80`,
        position: "relative",
        minHeight: "200px",
        overflow: "hidden",
        background: "whitesmoke",
      }}
    >
      <div
        className={`image-container ${isZooming ? "zoom" : ""}`}
        style={{
          backgroundImage: `url(${cardData[currentTextIndex].image_url})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          transition: "transform 0.5s ease-in-out",
          zIndex: 0,
          overflow: "hidden",
          animation: isZooming ? "zoomIn 10s ease-in-out forwards" : "none",
        }}
      >
        <div
          className="blur-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "20%",
              backgroundImage: `url(${cardData[currentTextIndex].image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
              filter: "blur(20px)",
              transform: "scale(1.1)",
              zIndex: -1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "20%",
              backgroundImage: `url(${cardData[currentTextIndex].image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "bottom center",
              filter: "blur(20px)",
              transform: "scale(1.1)",
              zIndex: -1,
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: `${color}20`,
          padding: "10px",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <FontAwesomeIcon
          icon={faPlay}
          onClick={handleStartSpeaking}
          style={{
            fontSize: "24px",
            cursor: "pointer",
            opacity: isFinished ? 0.5 : 1,
            pointerEvents: !isSpeakingGlobal && voicesLoaded ? "auto" : "none",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          height: "90%",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontSize: "18px",
            marginTop: "0px",
            color: "#333",
            position: "relative",
            zIndex: 1,
            background: "white",
            borderRadius: "10px",
            padding: "5px 10px",
            boxShadow: "0px 0px 10px 1px gainsboro",
            textAlign: "center",
          }}
        >
          {cardData[currentTextIndex].text}
        </p>
      </div>
    </div>
  );
};

const VideoScroller = ({ setStreak, setXP, currentSet }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [cards, setCards] = useState(
    localStorage.getItem("lastVideoSet")
      ? JSON.parse(localStorage.getItem("lastVideoSet"))
      : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeakingGlobal, setIsSpeakingGlobal] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // New state for scrolling

  useEffect(() => {
    const handleLoadVoices = () => {
      setVoicesLoaded(true);
    };

    window.speechSynthesis.onvoiceschanged = handleLoadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (
      cards.length < 1 &&
      !localStorage.getItem("lastVideoSet") &&
      (currentSet != null || currentSet != undefined)
    ) {
      fetchCards();
    }
  }, []);

  const handleScroll = () => {
    if (isFetching) return; // Prevent scroll event during fetching

    const container = containerRef.current;
    if (!container) return;
    console.log(currentIndex)

    const newIndex = Math.floor(container.scrollTop / container.clientHeight); // Adjust for padding
    setCurrentIndex(newIndex);
    const threeBeforeEnd = cards.length - 1;

    // Start fetching when three cards away from the end
    if (currentIndex >= threeBeforeEnd && !isFetching) {
      setIsFetching(true);

      fetchCards();
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    // Adding scroll event listener
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [containerRef]);

  const fetchCards = async () => {
    const options = {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: currentSet,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:9000/generate-content",
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch new cards");
      }

      const data = await response.json();
      // Append new cards and update localStorage

      setCards((prevCards) => [...prevCards, ...data]);
      localStorage.setItem("lastVideoSet", JSON.stringify([...cards, ...data]));

      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching new cards:", error);
      setIsFetching(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isFetching && (
        <p
          style={{
            position: "absolute",
            top: "1%",
            textAlign: "center",
            backgroundColor: "white",
            padding: "5px 10px",
            borderRadius: "100px",
            display: "flex",
            width: "300px",
            justifyContent: "space-around",
            boxShadow: "0px 0px 1px 1px gainsboro",
            zIndex: "999",
          }}
        >
          Loading More Cards...
          <div className="loader_mini"></div>
        </p>
      )}
      {cards.length > 1 ? (
        <div ref={containerRef} style={containerStyle} onScroll={handleScroll}>
          {cards.map((item, index) => (
            <div key={index} ref={(el) => (cardsRef.current[index] = el)}>
              <div style={cardContainerStyle}>
                {!isLoading && (
                  <Card
                    data={item}
                    setIsSpeakingGlobal={setIsSpeakingGlobal}
                    voicesLoaded={voicesLoaded}
                    isSpeakingGlobal={isSpeakingGlobal}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <p>Initializing Video Scroller...</p>
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default VideoScroller;
