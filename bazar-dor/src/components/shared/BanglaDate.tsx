"use client";

import { useEffect, useState } from "react";

import { getBanglaDate } from "@/components/shared/utils";

const BanglaDate = () => {
    const [date, setDate] = useState("");

    useEffect(() => {
        setDate(getBanglaDate());
    }, []);

    return <span>{date}</span>;
};

export default BanglaDate;