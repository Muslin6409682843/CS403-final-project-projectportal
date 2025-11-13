import React from "react";
import "../assets/background.css";

function AboutCSTU() {
  return (
    <div
      className="main-background"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            color: "#333",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          ติดต่อ สาขาวิชาวิทยาการคอมพิวเตอร์ (CSTU)
        </h1>

        <div
          style={{
            maxWidth: "700px",
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            lineHeight: "1.8",
            fontSize: "18px",
            color: "#444",
          }}
        >
          <p>
            <strong>
              สาขาวิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต
            </strong>
          </p>
          <p>
            อาคารบรรยายรวม 2 คณะวิทยาศาสตร์และเทคโนโลยี
            <br />
            มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต ปทุมธานี 12120
          </p>

          <p>
            <strong>โทรศัพท์:</strong> 0-2986-9154,
            <br />
            0-2986-9156, 0-2986-9138-39,
            <br />
            0-2564-4440-59 ต่อ 2157, 2714
            <br />
            <strong>โทรสาร:</strong> 0-2986-9157
          </p>

          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:scitu_cs@sci.tu.ac.th"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              scitu_cs@sci.tu.ac.th
            </a>
          </p>

          <p>
            <strong>Facebook:</strong>{" "}
            <a
              href="https://www.facebook.com/CSTUadmissioncenter"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              @CSTUadmissioncenter
            </a>
          </p>

          {/* Google Map Embed */}
          <div
            style={{
              marginTop: "40px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <iframe
              title="CSTU Location (LC2, Thammasat University)"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.071834523568!2d100.60372807503664!3d14.073576289741998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e27fed232d46db%3A0xf64ac3d88901d840!2sLearning%20Center%202%2C%20Tambon%20Khlong%20Nung%2C%20Amphoe%20Khlong%20Luang%2C%20Chang%20Wat%20Pathum%20Thani%2012120!5e0!3m2!1sen!2sth!4v1728277190730!5m2!1sen!2sth"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutCSTU;
