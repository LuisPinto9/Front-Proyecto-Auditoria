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
  const [id, setId] = useState(null);
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
    axios.get(`${import.meta.env.VITE_API_URL}/programs/`)
      .then((response) => {
        // Mapear la respuesta para ajustarse a la estructura deseada
        const listPrograms = response.data.data.map(program => ({
          name: program.name,
          code: program._id
        }));
  
        setPrograms(listPrograms);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const typies = [
    { name: "Cedula", code: "CC" },
    { name: "Tarjeta Identidad", code: "TI" },
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
    // Actualizar el estado con el primer archivo seleccionado
    setFile(e.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No hay archivo seleccionado.' });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      console.log(result)
      setUrlImage(result)
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Archivo subido correctamente.' });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error subiendo el archivo.' });
    }
  };

  const handleSave = () => {
    const studentData = {
        id: id,
        Identification: identification,
        code: code,
        documentType: selectedType ? selectedType.code : "Ninguno",
        firstName: firstName,
        lastName: lastName,
        birthdate: date,
        cellphone: cellphone,
        email: email,
        state: selectedState ? selectedState.code : "Ninguno",
        program: selectedProgram ? selectedProgram.code : "Ninguno"
      };
    const userData = {
        username: email,
        password: password,
        role: selectedRole ? selectedRole.code : "Ninguno",
        image: urlImage,
    }

      axios.post(`${import.meta.env.VITE_API_URL}/students/`, studentData)
      .then((response) => {
        console.log(response.data.data);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Estudiante Guardado.' });
      })
      .catch((error) => {
        console.log(error)
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error guardando el estudiante.' });
    });

    axios.post(`${import.meta.env.VITE_API_URL}/login/save`, userData)
      .then((response) => {
        console.log(response.data.data);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Creado.' });
      })
      .catch((error) => {
        console.log(error)
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error creando el usuario.' });
    });
  };

  return (
    <div className="card p-4 m-4">
      <div className="row">
        <div className="col-md-6">
          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">ID</span>
            <InputNumber
              useGrouping={false}
              value={id}
              onValueChange={(e) => setId(e.value)}
              placeholder="ID"
            />
          </div>

          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">Identificacion</span>
            <InputNumber
              useGrouping={false}
              value={identification}
              onValueChange={(e) => setIdentification(e.value)}
              placeholder="Identificacion"
            />
          </div>

          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">Codigo</span>
            <InputNumber
              useGrouping={false}
              value={code}
              onValueChange={(e) => setCode(e.value)}
              placeholder="Codigo"
            />
          </div>

          <div className="card mb-3">
            <Dropdown
              value={selectedType}
              onChange={(e) => setSelectedType(e.value)}
              options={typies}
              optionLabel="name"
              placeholder="Select type"
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
              placeholder="primer nombre"
            />
          </div>

          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon ">LN</span>
            <InputText
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="LastName"
            />
          </div>

          <div className="card mb-3">
            <Calendar value={date} onChange={(e) => setDate(e.value)} />
          </div>

          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">Celular</span>
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
            <span className="p-inputgroup-addon">Email</span>
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo"
            />
          </div>

          <div className="card mb-3">
            <Dropdown
              value={selectedState}
              onChange={(e) => setSelectedState(e.value)}
              options={states}
              optionLabel="name"
              placeholder="Select state"
              className="w-full"
            />
          </div>

          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon">Password</span>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="mb-3">
            <Dropdown
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.value)}
              options={role}
              optionLabel="name"
              placeholder="Select role"
              className="w-full"
            />
          </div>

          <div className="mb-3">
            <Dropdown
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.value)}
              options={programs}
              optionLabel="name"
              placeholder="Select program"
              className="w-full"
            />
          </div>

          <div className="card mb-3">
            <Toast ref={toast}></Toast>
            <FileUpload
              mode="basic"
              name="demo[]"
              accept="image/*"
              maxFileSize={1000000}
              customUpload
              uploadHandler={uploadFile}
              onSelect={handleFileSelect}
            />
          </div>
          <Button label="Guardar" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;
