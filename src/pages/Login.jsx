import React, { useState } from "react";

const Login = () => {
  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:4000/login/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.text();
    console.log(result);
  };
  return (
    <div className="App">
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
};

export default Login;
