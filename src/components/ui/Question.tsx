import * as React from "react";

interface QuestionProps {
    question: string
}

const Question: React.FC<QuestionProps> = ({question}) => {
    return (
        <p className="text-[#2D4A5A] text-[24px] font-semibold">{question}</p>
    )
}

export { Question }