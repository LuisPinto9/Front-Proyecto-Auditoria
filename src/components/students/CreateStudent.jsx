import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import axios from "axios";

const CreateStudent = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [date, setDate] = useState(null);
  const [password, setPassword] = useState("");
  const [identification, setIdentification] = useState(null);
  const [code, setCode] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cellphone, setCellphone] = useState(null);
  const [file, setFile] = useState(null);
  const [urlImage, setUrlImage] = useState();
  const toast = useRef(null);

  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/programs/`)
      .then((response) => {
        // Mapear la respuesta para ajustarse a la estructura deseada
        const listPrograms = response.data.data.map((program) => ({
          name: program.name,
          code: program._id,
        }));

        setPrograms(listPrograms);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const types = [
    { name: "Cédula", code: "CC" },
    { name: "Tarjeta Identidad", code: "TI" },
    { name: "Cédula de extranjería", code: "CE" },
  ];

  const states = [
    { name: "matriculado", code: "matriculado" },
    { name: "no matriculado", code: "no matriculado" },
  ];

  const role = [
    { name: "estudiante", code: "student" },
    { name: "administrador", code: "admin" },
  ];

  const handleFileSelect = (e) => {
    setFile(e.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "No hay archivo seleccionado.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.text();
      console.log(result);
      setUrlImage(result);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Archivo subido correctamente.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error subiendo el archivo.",
      });
    }
  };

  const handleSave = () => {
    if (!validateFields()) {
      return;
    }
    const studentData = {
      id: identification,
      Identification: identification,
      code: code,
      documentType: selectedType ? selectedType.code : "Ninguno",
      firstName: firstName,
      lastName: lastName,
      birthdate: date,
      cellphone: cellphone,
      email: email,
      state: selectedState ? selectedState.code : "Ninguno",
      program: selectedProgram ? selectedProgram.code : "Ninguno",
    };
    const userData = {
      username: email,
      password: password,
      role: selectedRole ? selectedRole.code : "Ninguno",
      image: urlImage,
    };

    //uploadFile();
    axios
      .post(`${import.meta.env.VITE_API_URL}/students/`, studentData)
      .then((response) => {
        console.log(response.data.data);
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Estudiante Guardado.",
        });
      })
      .catch((error) => {
        console.log("error"+error.message);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response.data.error,
        });
      });

    axios
      .post(`${import.meta.env.VITE_API_URL}/users/save`, userData)
      .then((response) => {
        console.log(response.data.data);
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Usuario Creado.",
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response.data.error,
        });
      });
  };

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "El correo electrónico no es válido.",
      });
      return false;
    }

    if (cellphone && cellphone.toString().length !== 10) {
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "El número de celular debe tener 10 dígitos.",
      });
      return false;
    }
    const requiredFields = [
      { value: firstName, name: "Primer nombre" },
      { value: lastName, name: "Apellido" },
      { value: email, name: "Correo" },
      { value: password, name: "Contraseña" },
      { value: selectedType, name: "Tipo de documento" },
      { value: selectedState, name: "Estado" },
      { value: selectedRole, name: "Rol" },
      { value: selectedProgram, name: "Programa" },
      { value: date, name: "Fecha de nacimiento" },
      { value: identification, name: "Identificación" },
      { value: code, name: "Código" },
      { value: cellphone, name: "Celular" },
    ];

    const emptyField = requiredFields.find((field) => !field.value);
    if (emptyField) {
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: `Todos los campos son requeridos. Por favor, complete el campo "${emptyField.name}".`,
      });
      return false;
    }

    return true;
  };

  const cleanFields = () => {
    setSelectedType(null);
    setSelectedState(null);
    setSelectedRole(null);
    setSelectedProgram(null);
    setDate(null);
    setPassword("");
    setId(null);
    setIdentification(null);
    setCode(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setCellphone(null);
    setFile(null);
    setUrlImage(null);
  };

  return (
    <div className="card p-4 m-4">
      <h3>Crear Usuarios</h3>
      <div className="row">
        <div className="col-md-">
          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">Identificación</span>
            <InputNumber
              useGrouping={false}
              value={identification}
              onValueChange={(e) => setIdentification(e.value)}
              placeholder="Ingrese solo números"
            />
          </div>

          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">Código estudiantil</span>
            <InputNumber
              useGrouping={false}
              value={code}
              onValueChange={(e) => setCode(e.value)}
              placeholder="Ingrese solo números"
            />
          </div>

          <div className="card mb-3">
            <Dropdown
              value={selectedType}
              onChange={(e) => setSelectedType(e.value)}
              options={types}
              optionLabel="name"
              placeholder="Tipo de identificación"
              className="w-full"
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nombre"
            />
          </div>

          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon ">Apellido</span>
            <InputText
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon ">Fecha de nacimiento</span>
            <Calendar value={date} onChange={(e) => setDate(e.value)} />
          </div>

          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">
              <i className="pi pi-mobile"></i>
            </span>
            <InputNumber
              useGrouping={false}
              value={cellphone}
              onValueChange={(e) => setCellphone(e.value)}
              placeholder="Celular"
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">
              <i className="pi pi-envelope"></i>
            </span>
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electronico"
            />
          </div>

          <div className="card mb-3">
            <Dropdown
              value={selectedState}
              onChange={(e) => setSelectedState(e.value)}
              options={states}
              optionLabel="name"
              placeholder="Estado"
              className="w-full"
            />
          </div>

          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">Contraseña</span>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
            />
          </div>
          <div className="mb-3">
            <Dropdown
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.value)}
              options={role}
              optionLabel="name"
              placeholder="Seleccione el rol"
              className="w-full"
            />
          </div>
        </div>

        <div className="col-md- mb-3">


          <div className="mb-3">
            <Dropdown
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.value)}
              options={programs}
              optionLabel="name"
              placeholder="Seleccione el programa academico"
              className="w-full"
            />
          </div>

          <div className="card mb-6">
            <Toast ref={toast}></Toast>
            <FileUpload
            mode="basic"
              name="demo[]"
              multiple
              accept="image/*"
              maxFileSize={1000000}
              customUpload
              uploadHandler={uploadFile}
              onSelect={handleFileSelect}
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              severity="success"
              label="Guardar"
              onClick={handleSave}
              style={{ marginRight: "1rem" }}
            />
            <Button severity="warning" label="Limpiar" onClick={cleanFields} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;
