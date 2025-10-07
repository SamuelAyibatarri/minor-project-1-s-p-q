import * as React from "react";

interface QProgressProps {
    currentIndex: number
    totalLength: number
}

const QProgress: React.FC<QProgressProps> = ({currentIndex, totalLength}) => {
    if (currentIndex <= totalLength) {
         return (
        <p className="text-[#2D4A5A] text-[18px] font-normal">{currentIndex}/{totalLength}</p>
    )
} else { 
    return (
        <p className="text-[#2D4A5A] text-[18px] font-normal">{totalLength}/{totalLength}</p>
    )
}
}

export { QProgress }