'use client';

import React, { useEffect, useState } from "react";
import Head from 'next/head';
import DataTable from "../../components/dataTable/DataTable";
import { PricingPlan } from '../../../types/types'; // Asegúrate de que la ruta sea correcta
import Spinner from "../../components/spinner/Spinner";

export default function plans() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(`/api/plans`);
                if (!response.ok) {
                    throw new Error("Error fetching clients");
                }
                const data = await response.json();
                setPlans(data); // Asumiendo que la respuesta tiene la estructura que proporcionaste
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);
    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;
    return (
        <div>
            <Head>
                <title>Planes</title>
            </Head>
            <DataTable initialData={plans} sectionTitle="Planes" excludedHeaders={['planfeature']} endpoint="plans"/>
        </div>
    )
};
