import { getBanglaDate } from "@/components/shared/utils";

const BanglaDate = () => {
    const date = getBanglaDate();

    return <span>{date}</span>;
};

export default BanglaDate;