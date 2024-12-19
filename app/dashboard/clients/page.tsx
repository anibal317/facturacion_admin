'use client';

import React, { useState } from "react";
import Head from 'next/head';
import DataTable from "../../components/dataTable/DataTable";
import { User } from '@/types/types'; // Asegúrate de que la ruta sea correcta


export default function clients() {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: false },
        // Agrega más usuarios si es necesario
      ]);

    const handleDataChange = (newData: User[]) => {
        setUsers(newData);
    };

    return (
        <div>
            <Head>
                <title>Clientes</title>
            </Head>
            <h1>Data Table with CRUD Operations</h1>
            <DataTable initialData={users} onDataChange={handleDataChange} />
        </div>
    )
};
