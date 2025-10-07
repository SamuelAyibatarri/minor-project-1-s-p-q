import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { QProgress } from "@/components/ui/QProgress";
import { Question } from "./components/ui/Question";
import { useEffect, useState} from "react";
// import { GoogleGenAI } from "@google/genai";
import { PersonalitySummaryGenerator } from "./components/GeminiSummarizer"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as Quiz from "./quiz"; // Assuming Quiz types and questionsList are defined here

function findNextRandomIndex(answeredIndexes: number[]): number | null {
    const total = Quiz.questionsList.length;
    if (answeredIndexes.length === total) {
        return null;
    }

    const availableIndexes = Quiz.questionsList
      .map((_, index) => index)
      .filter(index => !answeredIndexes.includes(index));

    // If for some reason the array is empty after filtering (shouldn't happen if total check works)
    if (availableIndexes.length === 0) {
        return null; 
    }
    
    const randomIndex = Math.floor(Math.random() * availableIndexes.length);
    // Use nullish coalescing for safety
    return availableIndexes[randomIndex] ?? null; 
}

function handleReload() {
  window.location.reload();
}


function App() {
  // States
  const [userScores, setUserScores] = useState<Quiz.UserScores>({
    OPN: 0,
    CST: 0,
    EXT: 0,
    AGR: 0,
    NRO: 0
  })

  const [opnScores, setOpnScores] = useState<number[]>([]);
  const [cstScores, setCstScores] = useState<number[]>([]);
  const [extScores, setExtScores] = useState<number[]>([]);
  const [agrScores, setAgrScores] = useState<number[]>([]);
  const [nroScores, setNroScores] = useState<number[]>([]);

  // Quiz progression states
  const [sliderValue, setSliderValue] = useState<number[]>([50]);
  const [answeredIndexes, setAnsweredIndexes] = useState<number[]>([]); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); 
  const [progressVal, setProgressVal] = useState<number>(0);

  // --- DERIVED STATE ---
  const isQuizComplete = answeredIndexes.length === Quiz.questionsList.length;
  const currentQuestion: Quiz.Question = Quiz.questionsList[currentQuestionIndex] || {
    question: isQuizComplete ? "Quiz Complete! You can view your results." : "Welcome to the Quiz. Click Next to begin.",
    dimension: "NONE",
    type: "reversed"
  };

  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue);
  }

  function updateProgressBar(newValue: number){
    setProgressVal(newValue);
  }

  function updateUserScore(arg: Quiz.DimensionScoreResult): void {
      const newScore = arg.score;
      switch(arg.dimension) {
          case "OPN":
              setOpnScores(prevScores => [...prevScores, newScore]); 
              break;
          case "CST":
              setCstScores(prevScores => [...prevScores, newScore]);
              break;
          case "EXT":
              setExtScores(prevScores => [...prevScores, newScore]);
              break;
          case "AGR":
              setAgrScores(prevScores => [...prevScores, newScore]);
              break;
          case "NRO":
              setNroScores(prevScores => [...prevScores, newScore]);
              break;
          default:
              console.error("Error: Invalid dimension received!");
      }
  }

  useEffect(() => {
    // Only run on mount and if the quiz list is ready
    if (Quiz.questionsList.length === 0 && currentQuestionIndex === -1) {
        const initialIndex = findNextRandomIndex([]);
        if (initialIndex !== null) {
            setCurrentQuestionIndex(initialIndex);
            setAnsweredIndexes([initialIndex]);
        }
    }
  }, [currentQuestionIndex])


  const answerQuestion = () => {
    const totalQuestions = Quiz.questionsList.length;
    
    if (isQuizComplete || currentQuestionIndex === -1) {
        console.log("Quiz finished or not started.");
        return;
    }

    let userEntry: number = Math.ceil(sliderValue[0] / 20); 

    if (isNaN(userEntry) || userEntry > 5) {
        console.error("Invalid slider input. Cannot proceed.");
        return;
    } 
    if(userEntry < 1) {
      userEntry = 1;
      console.log("The Slider Input was zero and was adjusted to 1")
    }
    
    updateUserScore(Quiz.calculateDimensionScore(userEntry, currentQuestion));

    setAnsweredIndexes(prevIndexes => {
        const newIndexes = [...prevIndexes, currentQuestionIndex];
        
        const newProgressValue = Math.floor((newIndexes.length / totalQuestions) * 100);
        updateProgressBar(newProgressValue); 
        
        const nextIndex = findNextRandomIndex(newIndexes);
        
        if (nextIndex !== null) {
            setCurrentQuestionIndex(nextIndex); 
            setSliderValue([50]); 
        } else {
            setCurrentQuestionIndex(-1); 
        }

        return newIndexes;
    });
    console.log(answeredIndexes);
  };

  function calculateTotalScore(): void {
    let opnAvrg: number = Quiz.calculateDimensionAverage(opnScores);
    let cstAvrg: number = Quiz.calculateDimensionAverage(cstScores);
    let extAvrg: number = Quiz.calculateDimensionAverage(extScores);
    let agrAvrg: number = Quiz.calculateDimensionAverage(agrScores);
    let nroAvrg: number = Quiz.calculateDimensionAverage(nroScores);

    let _:Quiz.UserScores = {
      OPN: opnAvrg, 
      CST: cstAvrg, 
      EXT: extAvrg, 
      AGR: agrAvrg, 
      NRO: nroAvrg  
    }

    setUserScores(_);
  }

  return (
    <>
    <div className="bg-[#EAEDEE] flex justify-center items-center w-screen h-screen">
      <div className=" flex flex-col w-[650px] h-auto bg-[#FEFEFE] rounded-xl shadow-2xl justify-around p-8">
        
        <div className="w-full flex justify-center items-center mb-4">
          {/* Using answeredIndexes.length for correct display */}
          <QProgress currentIndex={answeredIndexes.length + 1} totalLength={Quiz.questionsList.length}/>
        </div>
        
        <div className="w-full flex justify-center items-center mb-8">
          <Progress className="w-[300px] h-[4px]" value={progressVal}/>
        </div>
        
        <div className="w-full flex justify-center items-center min-h-[60px] mb-8">
          <Question question={currentQuestion.question} />
        </div>

        {/* Display slider only if the quiz is not complete */}
        {!isQuizComplete && (
          <div className="w-full flex justify-center items-center flex-col">
              <Slider 
                className="w-[510px] m-[10px]" 
                value={sliderValue}
                max={100} 
                step={10} 
                onValueChange={handleSliderChange}
              />
              <div className="flex justify-between w-[510px] m-[10px]">
                <p className="text-[#98A6AE] text-[14px] font-semibold">I strongly disagree</p>
                <p className="text-[#98A6AE] text-[14px] font-semibold">I totally agree</p>
              </div>
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          <Button 
            className="text-[#2D4A5A] hover:text-[#2D4A5A]" 
            variant={"ghost"} 
            disabled={!isQuizComplete}
            onClick={handleReload} // Previous button still not implemented
          >
            Restart
          </Button>
          <Button 
            className="bg-[#2D4A5A]" 
            onClick={isQuizComplete && answeredIndexes.length > 49 ? () => { calculateTotalScore(); console.log("User Scores: ", userScores)} : answerQuestion} 
          >
            {isQuizComplete ? "Finish" : "Next"}
          </Button>

        </div>
        <div>
              <ScrollArea className={`h-[200px] w-full rounded-md border p-4 mt-[20px] ${isQuizComplete ? "flex" : "hidden"}`}>
                          <PersonalitySummaryGenerator _={userScores} />
              </ScrollArea>

        </div>
      </div>
    </div>
    </>
  )
}

export default App;