"use client"
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Facturas() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [listaFacturas, setListaFacturas] = useState<any[]>([]);

  useEffect(() => {
    obtenerClientes();
    obtenerFacturas();
  }, []);

  async function obtenerClientes() {
    const { data } = await supabase.from('clientes').select('*');
    if (data) setClientes(data);
  }

  async function obtenerFacturas() {
    const { data } = await supabase.from('facturas').select('*').order('id', { ascending: false });
    if (data) setListaFacturas(data);
  }

  async function guardarFactura() {
    if (!clienteId) return alert("Por favor, selecciona un cliente primero.");
    const { error } = await supabase.from('facturas').insert({ cliente_id: clienteId, descripcion, monto: parseFloat(monto), estado });
    if (error) alert("Error: " + error.message);
    else { setDescripcion(""); setMonto(""); obtenerFacturas(); }
  }

  async function marcarComoPagado(id: number) {
    const { error } = await supabase.from('facturas').update({ estado: 'Pagado' }).eq('id', id);
    if (error) alert("Error: " + error.message);
    else obtenerFacturas();
  }

  // NUEVA FUNCIÓN: Elimina la factura de la base de datos
  async function eliminarFactura(id: number) {
    if (!confirm("¿Estás seguro de que quieres borrar esta factura?")) return;
    
    const { error } = await supabase.from('facturas').delete().eq('id', id);
    if (error) alert("Error: " + error.message);
    else obtenerFacturas(); 
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Facturas</h1>
      
      <div className="p-6 border rounded-lg shadow-sm bg-white max-w-md mb-10">
        <h2 className="text-xl font-bold mb-4 text-green-600">Crear Nueva Factura</h2>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} className="border p-2 w-full mb-3 rounded-md bg-white">
          <option value="">-- Selecciona un cliente --</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <input type="text" placeholder="Descripción (ej. Diseño Web)" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="border p-2 w-full mb-3 rounded-md" />
        <input type="number" placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} className="border p-2 w-full mb-3 rounded-md" />
        <select value={estado} onChange={(e) => setEstado(e.target.value)} className="border p-2 w-full mb-4 rounded-md bg-white">
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
        </select>
        <button onClick={guardarFactura} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full font-bold">Guardar Factura</button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Lista de Facturas</h2>
      <div className="grid grid-cols-1 gap-4">
        {listaFacturas.map((factura) => {
          const cliente = clientes.find(c => c.id === factura.cliente_id);
          return (
            <div key={factura.id} className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{factura.descripcion}</p>
                <p className="text-gray-600">Cliente: {cliente ? cliente.nombre : 'Desconocido'}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <p className="font-bold text-xl text-gray-800">${factura.monto}</p>
                <span className={`px-2 py-1 text-sm rounded-full ${factura.estado === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {factura.estado}
                </span>
                <div className="flex gap-2 mt-1">
                  {factura.estado === 'Pendiente' && (
                    <button onClick={() => marcarComoPagado(factura.id)} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                      Pagado ✓
                    </button>
                  )}
                  {/* NUEVO BOTÓN: Eliminar factura */}
                  <button onClick={() => eliminarFactura(factura.id)} className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                    Borrar 🗑️
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}