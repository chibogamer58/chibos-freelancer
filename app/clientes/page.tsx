"use client"
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Clientes() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [listaClientes, setListaClientes] = useState<any[]>([]);

  useEffect(() => {
    obtenerClientes();
  }, []);

  async function obtenerClientes() {
    const { data } = await supabase.from('clientes').select('*');
    if (data) setListaClientes(data);
  }

  async function guardarCliente() {
    const { error } = await supabase
      .from('clientes')
      .insert({ nombre, email, empresa });

    if (error) {
      alert("Error: " + error.message);
    } else {
      setNombre(""); setEmail(""); setEmpresa("");
      obtenerClientes(); // Recarga la lista automáticamente
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Clientes</h1>
      
      <div className="p-6 border rounded-lg shadow-sm bg-white max-w-md mb-10">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Agregar Nuevo Cliente</h2>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border p-2 w-full mb-3 rounded-md" />
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full mb-3 rounded-md" />
        <input type="text" placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} className="border p-2 w-full mb-4 rounded-md" />
        <button onClick={guardarCliente} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full font-bold">
          Guardar Cliente
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Directorio de Clientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {listaClientes.map((cliente) => (
          <div key={cliente.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <p className="font-bold text-lg">{cliente.nombre}</p>
            <p className="text-gray-600">{cliente.email}</p>
            <p className="text-sm text-blue-600 font-semibold mt-2">Empresa: {cliente.empresa}</p>
          </div>
        ))}
      </div>
    </div>
  );
}