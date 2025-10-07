import React, { useState, useCallback } from 'react';
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer"
import { Button } from "@/components/ui/button";
import { GoogleGenAI } from "@google/genai";

// 1. Define the type for the personality data object
interface BigFiveData {
    OPN: number; // Openness
    CST: number; // Conscientiousness
    EXT: number; // Extraversion
    AGR: number; // Agreeableness
    NRO: number;  // Neuroticism
}

interface BigFiveDataProps {
    _: BigFiveData;
}


const GEMINI_API_KEY: string = "AIzaSyBcaP-RGpZEop1ymuf56yQ9-VfR8E6dUlM"; // ⚠️ Don't forget to change this before pushing to github

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// System Instruction
const systemInstruction: string = `You are an expert personality analyst specializing in the Big Five model.
Your task is to provide a concise, professional, and insightful summary of a user's personality.
Only use the provided scores and focus on describing the implications of high, average, and low scores.Try to keep your
response as simple and straight to the point as possible. Include the scores you recieved in a more human readable form before your analysis. 
Use proper markdown tools to make it look more presentable, use spacing to improve readability. Avoid emojis at all cost.
DO NOT ask the user for more information or include any conversational filler.`;


const PersonalitySummaryGenerator: React.FC<BigFiveDataProps> = ({_}) => {
    // 2. Use explicit string and boolean types for useState
    const [summary, setSummary] = useState<string>("Click 'Generate Summary' to analyze the data.");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null); // State can be a string or null

    // 3. Use useCallback and define the function as async
    const generateSummary = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSummary("Generating summary...");

        // Main Prompt
        const promptContent: string = `Analyze and describe the personality based on these Big Five scores: ${JSON.stringify(_)}`;
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: promptContent,
                    config: {
                        systemInstruction: systemInstruction,
                        temperature: 0.1,
                        maxOutputTokens: 1024,
                    }
                });

                // 1. Check if response.text exists before using it
                if (response.text) {
                    // Update the state with the Gemini response
                    setSummary(response.text.trim());
                } else {
                    // 2. Handle the case where the text is missing (e.g., blocked content)
                    console.error("Gemini API call succeeded but returned no text. Check safety settings or content filters.");
                    setSummary("Analysis failed: The content was blocked or the model returned an empty response.");
                    
                    // Optional: Log details about why it might have been blocked
                    if (response.candidates && response.candidates.length > 0) {
                        console.log("Blocking reason:", response.candidates[0].finishReason);
                    }
                }

            } catch (err: unknown)  { // Use 'unknown' to safely handle generic errors
            console.error("An error occurred while calling the Gemini API:", err);
            setError("Failed to generate summary. Please check the console for details.");
            setSummary("");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className='flex justify-center items-center flex-col'>
            <Button 
            className="text-[#2D4A5A] hover:text-[#2D4A5A] text-[18px] w-full h-[40px]" 
            variant={"ghost"} 
            onClick={generateSummary}
            disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Generate Summary'}
          </Button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <div className={`mt-[20px] p-1 ${isLoading ? "text-[#98A6AE]" : "text-[#2D4A5A]"} w-auto`}>
                <MarkdownRenderer _={summary} />
            </div>
        </div>
    );
};

export { PersonalitySummaryGenerator };