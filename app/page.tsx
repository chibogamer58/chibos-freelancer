"use client"
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function Home() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [dineroCobrado, setDineroCobrado] = useState(0);
  const [dineroPendiente, setDineroPendiente] = useState(0);

  useEffect(() => {
    async function cargarResumen() {
      const { data: clientes } = await supabase.from('clientes').select('*');
      if (clientes) setTotalClientes(clientes.length);

      const { data: facturas } = await supabase.from('facturas').select('*');
      if (facturas) {
        let cobrado = 0;
        let pendiente = 0;
        
        facturas.forEach(factura => {
          if (factura.estado === 'Pagado') cobrado += Number(factura.monto);
          if (factura.estado === 'Pendiente') pendiente += Number(factura.monto);
        });

        setDineroCobrado(cobrado);
        setDineroPendiente(pendiente);
      }
    }
    
    cargarResumen();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">¡Hola, Freelancer! 👋</h1>
      <p className="text-gray-600 text-lg mb-8">Aquí tienes el resumen financiero de tu negocio hoy.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 border rounded-xl shadow-sm border-l-4 border-l-blue-600">
          <h2 className="text-gray-500 font-semibold mb-1">Total de Clientes</h2>
          <p className="text-3xl font-bold text-gray-800 mb-4">{totalClientes}</p>
          <Link href="/clientes" className="text-blue-600 hover:underline font-medium text-sm">Ver clientes →</Link>
        </div>

        <div className="bg-white p-6 border rounded-xl shadow-sm border-l-4 border-l-green-600">
          <h2 className="text-gray-500 font-semibold mb-1">Dinero Cobrado</h2>
          <p className="text-3xl font-bold text-gray-800 mb-4">${dineroCobrado}</p>
          <Link href="/facturas" className="text-green-600 hover:underline font-medium text-sm">Ver facturas →</Link>
        </div>

        <div className="bg-white p-6 border rounded-xl shadow-sm border-l-4 border-l-yellow-500">
          <h2 className="text-gray-500 font-semibold mb-1">Dinero Pendiente</h2>
          <p className="text-3xl font-bold text-gray-800 mb-4">${dineroPendiente}</p>
          <Link href="/facturas" className="text-yellow-600 hover:underline font-medium text-sm">Cobrar facturas →</Link>
        </div>

      </div>
    </div>
  );
}