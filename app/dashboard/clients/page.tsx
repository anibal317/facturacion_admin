'use client';

import React, { useEffect, useState } from "react";
import Head from 'next/head';
import DataTable from "../../components/dataTable/DataTable";
import { Client } from '../../../types/types'; // Asegúrate de que la ruta sea correcta
import Spinner from "../../components/spinner/Spinner";


export default function clients() {
    const [clients, setClients] = useState<Client[]>([]);
  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients?all=true`);
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
    return (
        <div>
            <Head>
                <title>Clientes</title>
            </Head>
            <h1>Data Table with CRUD Operations</h1>
            <DataTable initialData={clients} sectionTitle="Clientes" endpoint="clients"/>
        </div>
    )
};
