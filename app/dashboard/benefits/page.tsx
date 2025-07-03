'use client';

import React, { useEffect, useState } from "react";
import { Benefits } from '../../../types/types';
import Spinner from "../../components/spinner/Spinner";
import Head from 'next/head';
import DataTable from "../../components/dataTable/DataTable";

export default function faqs() {
    const [faqs, setFaqs] = useState<Benefits[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/benefits?all=true`);
                if (!response.ok) {
                    throw new Error("Error fetching clients");
                }
                const data = await response.json();
                setFaqs(data.data); // Asumiendo que la respuesta tiene la estructura que proporcionaste
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
            <DataTable initialData={faqs} sectionTitle="Beneficios" endpoint="benefits"/>
        </div>
    )
};
