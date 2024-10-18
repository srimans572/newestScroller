// src/CareersPage.js
import React from "react";
import CareerCard from "../components/CareerCard";

const careers = [
  {
    title: "Frontend Engineer",
    timeCommitment: "10-20hrs/ week",
    description:
      "You will help us build and maintain the frontend at Scroller. We are looking for interns with strong experience in React.",
  },
  {
    title: "Backend Engineer",
    timeCommitment: "10-20hrs/ week",
    description:
      "You will help us build, maintain and improve our backend at Scroller. We are looking for interns with strong skills in Node.js and Express and good knowledge about backend programming in general. ",
  },
  {
    title: "Social Media Marketing Intern",
    timeCommitment: "5-10hrs/ week",
    description:
      "You will help promote and market Scroller on social media platforms like Instagram, TikTok and Reddit. We are looking for interns with knowledge in affiliate marketing, content creation and video production.",
  },
  // Add more career options here
];

const perks = [
    {
        header:"Hands-On Experience",
        desc:`Gain practical experience by working on real-world projects. This experience will make your resume stand out and show future employers your ability to apply skills effectively.`
    },
    {
        header:"Skill Development",
        desc:`Develop and enhance your technical and soft skills. The skills you acquire will be a strong asset to your resume and future career opportunities.`
    },
    {
        header:"Real-World Impact",
        desc:`Get involved in a meaningful startup that has a real influence on how people learn. You'll be contributing to something bigger, building your experience, and making a difference in the educational space.        `
    },
    {
        header:"Flexible Times",
        desc:`We understand that our interns have other time commitments, and accordingly, our assigned deliverables to interns have a very reasonable and flexible due date.`
    },
    {
        header:"Welcoming Environment",
        desc:`Our small team welcomes all new interns with a big heart! Expect to have fun sessions with the Scroller team at least once a month because at Scroller, we believe that there is more than just learning as an intern. We want to provide an experience you'd never forget. `
    },
    {
        header:"Compensation",
        desc:`Here at Scroller, we reward our interns for their dedication and hard work ranging from Scroller merchandise to gift cards. `
    },
]

const CareersPage = () => {
  return (
    <div
      style={{
        background: "black",
        height: "100vh",
        color: "white",
        padding: "50px 10vw",
        overflow: "scroll",
      }}
    >
      <p style={{ fontSize: "18px", color: "orange" }}>Join our remote team</p>
      <h1 style={{ fontSize: "40px" }}>Internships at Scroller</h1>
      <br></br>
      <div style={{ border: "1px dashed white", padding: "10px" }}>
        <h1>Our Mission</h1>
        <br></br>
        <p style={{ fontSize: "18px" }}>
          At Scroller, our mission is to transform the way individuals engage
          with learning by combining the dynamic interactivity of social media
          with the power of personalized education. We aim to empower users to
          enhance their knowledge and skills through an innovative platform that
          delivers AI-generated multiple-choice questions in a seamless,
          scrolling format. We are dedicated to making learning accessible,
          engaging, and effective for everyone.
        </p>
      </div>
      <br></br>
      <h1>Perks of Interning at Scroller</h1>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent:"center",}}>
        {perks.map((perks, index) => (
          <div
            style={{
              border: "1px dashed white",
              padding: "10px",
              width: "29%",
              margin:"10px",
            }}
          >
            <h2>{perks.header}</h2>
            <p>{perks.desc}</p>
          </div>
        ))}
      </div>
      <br></br>
      <h1>Open Positions</h1>
      <div className="careers-page">
        {careers.map((career, index) => (
          <CareerCard
            key={index}
            title={career.title}
            timeCommitment={career.timeCommitment}
            description={career.description}
          />
        ))}
      </div>
      <h1>How Your Applications Will Be Processed</h1>
      <p>Here at Scroller, we will assess your applications holistically, meaning we look at more than just your resume.</p>
      <br></br>
      <h1>Questions?</h1>
      <p>Don't hesitate to contact us through email: scrollercontact@gmail.com</p>
    </div>
  );
};

export default CareersPage;
