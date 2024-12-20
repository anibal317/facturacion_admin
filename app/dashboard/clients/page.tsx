'use client';

import React, { useEffect, useState } from "react";
import Head from 'next/head';
import DataTable from "../../components/dataTable/DataTable";
import { Client } from '../../../types/types'; // Asegúrate de que la ruta sea correcta
import Spinner from "../../components/spinner/Spinner";


export default function clients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [currentClient , setCurrentClient ] = useState<Client | null>(null);
  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [users, setUsers] = useState([
    //     { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
    //     { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: false },
    //     // Agrega más usuarios si es necesario
    // ]);
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients`);
                if (!response.ok) {
                    throw new Error("Error fetching clients");
                }
                const data = await response.json();
                setClients(data.data); // Asumiendo que la respuesta tiene la estructura que proporcionaste
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    const handleDataChange = (newData: Client[]) => {
        setCurrentClient(null);
    };

    return (
        <div>
            <Head>
                <title>Clientes</title>
            </Head>
            <h1>Data Table with CRUD Operations</h1>
            <DataTable initialData={clients} onDataChange={handleDataChange} />
        </div>
    )
};
