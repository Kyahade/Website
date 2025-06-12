// Initialize Firebase once
const firebaseConfig = {
  apiKey: "AIzaSyBjoiPRYbuA66QfsgG8bea0rgxML3dQRK4",
  authDomain: "mywebapp-9cce0.firebaseapp.com",
  projectId: "mywebapp-9cce0",
  storageBucket: "mywebapp-9cce0.firebasestorage.app",
  messagingSenderId: "505722389930",
  appId: "1:505722389930:web:716c66ab01d7133f1197d3"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function generateStudentID() {
  const year = new Date().getFullYear().toString().slice(-2); // e.g., "25"
  const random = Math.floor(100000 + Math.random() * 900000); // 6-digit random
  return `NU${year}${random}`;
}
function submitForm(event) {
  if (event) event.preventDefault(); // prevent form reload
const studentID = generateStudentID();
  // Get form values
  const gender = document.querySelector('input[name="gender"]:checked');
  const dob = document.getElementById("dob").value;
  const terms = document.getElementById("terms").checked;
  const display = document.getElementById("display_text");
  const campus = document.getElementById('campus').value;
  const academicTerm = document.getElementById('academicTerm').value;
  const program = document.getElementById('program').value;
  const fname = document.getElementById('fname').value.trim();
  const mname = document.getElementById('mname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const fullName = `${fname} ${mname} ${lname}`.trim();

  // Validate required fields
  if (!fname || !mname || !lname) {
    alert("Please enter your full name!");
    return;
  }
  if (!gender || !dob || !program || !terms || !campus || !academicTerm) {
    alert("Please complete all fields and accept the terms.");
    return;

  } // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
  }
  // // Password validation
  // if (password.length < 6) {
  //     alert("Password must be at least 6 characters long.");
  //     return;
  // }
  // Phone number validation
 const phonePattern = /^\d{10,11}$/;
 if (!phonePattern.test(phone)) {
     alert("Please enter a valid phone number (10–11 digits).");
     return;
 }

  // Prepare output string
  const output = `
  Student ID: ${studentID}
Full Name: ${fullName}
Gender: ${gender.value}
Date of Birth: ${dob}
Campus: ${campus}
Academic Term: ${academicTerm}
Course: ${program}
Email: ${email}
Phone: ${phone}
`;

  display.innerText = output;

  // Prepare data object for Firestore
  const data = {
    studentID: studentID,
    fullName: fullName,
    email: email,
    phone: phone,
    gender: gender.value,
    dob: dob,
    course: program,
    campus: campus,
    academicTerm: academicTerm, 
    termsAccepted: terms,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  // Add to Firestore collection 'registrations'
  db.collection("registrations").add(data)
  .then(() => {
    alert("Form Submitted Successfully!\n\n" + output);
    display.innerText = "Submitted successfully! Redirecting...";
    
    // Wait 5 seconds (5000 ms), then redirect
    setTimeout(() => {
      window.location.href = "look.html"; // Change this to your target HTML file
    }, 5000);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
    alert("Failed to submit. Please try again.");
  });
}

// Use this event listener approach and remove onclick in HTML button
document.addEventListener("DOMContentLoaded", function() {
  const submitBtn = document.querySelector("button[type='button']");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitForm);
  }
});
