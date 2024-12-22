'use client';

import React, { useEffect, useState } from "react";
import DataTable from "@/app/components/dataTable/DataTable";
import Spinner from "@/app/components/spinner/Spinner";
import Head from "next/head";
import { Features } from "@/types/types";

export default function links() {
    const [faqs, setFaqs] = useState<Features[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links`);
                if (!response.ok) {
                    throw new Error("Error fetching clients");
                }
                const data = await response.json();
                setFaqs(data); // Asumiendo que la respuesta tiene la estructura que proporcionaste
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;
    return (
        <div>
            <Head>
                <title>Beneficios</title>
            </Head>
            <h1>Data Table with CRUD Operations</h1>
            <DataTable initialData={faqs} sectionTitle="Links por sección" />
        </div>
    )
};
