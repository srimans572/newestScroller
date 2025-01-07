import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/Firebase";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setMobileDimension }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("s");
        localStorage.clear();
        navigate("/auth");
      })
      .catch((error) => {
        console.log("e");
      });
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setMobileDimension(mobile);
      if (!mobile) {
        setIsExpanded(true); // Ensure navbar is visible on larger screens
      } else {
        setIsExpanded(false);
      }
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize); // Add resize listener

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup listener on component unmount
    };
  }, []);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {localStorage.getItem("email") && isMobile && (
        <div
          style={{
            fontSize: "24px",
            color: "black",
            bottom: "10px",
            cursor: "pointer",
            position: "fixed",
            left: "10px",
            zIndex: "99999",
            display: "block", // Always show hamburger on mobile
          }}
          onClick={toggleNavbar}
        >
          {isExpanded ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                scale: "0.9",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                height={15}
              >
                <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
              </svg>
              <p style={{ fontSize: "10px", margin: "0px 0px" }}>Close</p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                scale: "0.8",
              }}
            >
              <p style={{ margin: "0px" }}>☰</p>
              <p style={{ fontSize: "10px", margin: "-5px 0px" }}>Menu</p>
            </div>
          )}
        </div>
      )}
      <div
        style={{
          display: isExpanded ? "flex" : "none",
          flexDirection: "column",
          width: "220px",
          height: "100vh",
          borderRight: "1px solid gainsboro",
          marginRight: isMobile ? "0px" : "0px",
          zIndex: "1000",
          color: "black",
          position: isExpanded && isMobile ? "absolute" : "relative",
          transition: "transform 0.3s ease",
          transform:
            isExpanded || !isMobile ? "translateX(0)" : "translateX(-100%)",
          backgroundColor: "#fcfcfc",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "start",
            flexDirection: "row",
            margin: "0px 0px 0px 0px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              margin: "50px 0px 0px 15px",
              backgroundColor: "white",
              border: "10px",
              boxShadow: "0px 0px 10px 1px gainsboro",
              border: "1px solid gainsboro",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3>S</h3>
          </div>
          <h1
            style={{
              margin: "42.5px 0px 20px 5px",
              textShadow: "2px 2px 5px gainsboro",
            }}
          >
            Scro<span style={{ fontStyle: "italic", color: "orange" }}>ll</span>
            er
          </h1>
        </div>
        <Link
          to={"/"}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px",
            color: "black",
            textDecoration: "none",
            display: "flex",
            width: "80px",
            justifyContent: "space-between",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            height={20}
          >
            <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
          </svg>
          <span>Home</span>
        </Link>
        <Link
          to={"/scrolls"}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px",
            color: "black",
            textDecoration: "none",
            display: "flex",
            width: "85px",
            justifyContent: "space-between",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={20}
            viewBox="0 0 384 512"
          >
            <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
          </svg>
          <span>
            Scrolls{" "}
            <span
              style={{
                position: "absolute",
                fontSize: "10px",
                background: "orange",
                borderRadius: "100px",
                padding: "1px 10px",
                marginLeft: "5px",
              }}
            >
              Beta
            </span>
          </span>
        </Link>
        {localStorage.getItem("email") && (
          <Link
            to={"/library"}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px",
              color: "black",
              textDecoration: "none",
              display: "flex",
              width: "113px",
              justifyContent: "space-between",
            }}
          >
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 28 28"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g fill="#212121" fill-rule="nonzero">
                  <path d="M5.9897,3 C7.0937,3 7.9897,3.896 7.9897,5 L7.9897,23 C7.9897,24.104 7.0937,25 5.9897,25 L4.0007,25 C2.8957,25 2.0007,24.104 2.0007,23 L2.0007,5 C2.0007,3.896 2.8957,3 4.0007,3 L5.9897,3 Z M12.9897,3 C14.0937,3 14.9897,3.896 14.9897,5 L14.9897,23 C14.9897,24.104 14.0937,25 12.9897,25 L10.9947,25 C9.8897,25 8.9947,24.104 8.9947,23 L8.9947,5 C8.9947,3.896 9.8897,3 10.9947,3 L12.9897,3 Z M22.0701,6.5432 L25.9301,22.0262 C26.1971,23.0972 25.5441,24.1832 24.4731,24.4512 L22.5101,24.9402 C21.4391,25.2072 20.3531,24.5552 20.0861,23.4832 L16.2261,8.0002 C15.9581,6.9282 16.6111,5.8432 17.6821,5.5752 L19.6451,5.0862 C20.7161,4.8182 21.8021,5.4712 22.0701,6.5432 Z"></path>
                </g>
              </g>
            </svg>
            <span>My Library</span>
          </Link>
        )}
        {localStorage.getItem("email") && (
          <Link
            to="/saved"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px",
              color: "black",
              textDecoration: "none",
              display: "flex",
              width: "105px",
              justifyContent: "space-between",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              height={20}
            >
              <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
            </svg>
            <span>Favorites</span>
          </Link>
        )}
        {localStorage.getItem("email") && (
          <Link
            to="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px",
              color: "black",
              textDecoration: "none",
              display: "flex",
              width: "80px",
              justifyContent: "space-between",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={20}
              viewBox="0 0 448 512"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
            </svg>
            <span>Profile</span>
          </Link>
        )}
        <Link
          to="https://forms.gle/aWnQhHmELkT1Mvhw6"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px",
            color: "black",
            textDecoration: "none",
            display: "flex",
            width: "127px",
            justifyContent: "space-between",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            height={20}
          >
            <path d="M256 0c53 0 96 43 96 96l0 3.6c0 15.7-12.7 28.4-28.4 28.4l-135.1 0c-15.7 0-28.4-12.7-28.4-28.4l0-3.6c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4l112 0c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5l64.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6L272 240c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 239.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64.3 0c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z" />
          </svg>{" "}
          <span>Report Bugs</span>
        </Link>
        <div style={{ position: "absolute", bottom: "50px" }}>
          {localStorage.getItem("email") ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "20px",
                color: "black",
                textDecoration: "none",
                display: "flex",
                justifyContent: "space-between",
                width: "90px",
                cursor: "pointer",
              }}
              onClick={async () => logout()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={20}
                viewBox="0 0 512 512"
              >
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
              <span>Log Out</span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "20px",
                color: "black",
                textDecoration: "none",
                display: "flex",
                justifyContent: "space-between",
                width: "90px",
                cursor: "pointer",
              }}
              onClick={async () => navigate("/auth")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={20}
                viewBox="0 0 512 512"
              >
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
              <span>Sign In</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
