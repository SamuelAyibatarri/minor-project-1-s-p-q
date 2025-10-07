export type Dimension = "OPN" | "CST" | "EXT" | "AGR" | "NRO"|"NONE"
export type QuestionType = "normal" | "reversed";

export interface Question {
    question: string;
    dimension: Dimension;
    type: QuestionType;
}

export interface DimensionScoreResult {
    dimension: Dimension;
    score: number;
}

export interface UserScores {
    OPN: number;
    CST: number;
    EXT: number;
    AGR: number;
    NRO: number;
}


export const questionsList: Question[] = [
    // OPN – Openness
    { question: "I have a vivid imagination", dimension: "OPN", type: "normal" },
    { question: "I spend time reflecting on things", dimension: "OPN", type: "normal" },
    { question: "I enjoy thinking about abstract ideas", dimension: "OPN", type: "normal" },
    { question: "I am full of ideas", dimension: "OPN", type: "normal" },
    { question: "I have a rich vocabulary", dimension: "OPN", type: "normal" },
    { question: "I do not enjoy going to art museums", dimension: "OPN", type: "reversed" },
    { question: "I have difficulty understanding abstract ideas", dimension: "OPN", type: "reversed" },
    { question: "I avoid philosophical discussions", dimension: "OPN", type: "reversed" },
    { question: "I seldom try new things", dimension: "OPN", type: "reversed" },
    { question: "I prefer routine over variety", dimension: "OPN", type: "reversed" },

    // CST – Conscientiousness
    { question: "I am always prepared", dimension: "CST", type: "normal" },
    { question: "I pay attention to details", dimension: "CST", type: "normal" },
    { question: "I follow a schedule", dimension: "CST", type: "normal" },
    { question: "I get chores done right away", dimension: "CST", type: "normal" },
    { question: "I make plans and stick to them", dimension: "CST", type: "normal" },
    { question: "I leave my belongings around", dimension: "CST", type: "reversed" },
    { question: "I shirk my duties", dimension: "CST", type: "reversed" },
    { question: "I make a mess of things", dimension: "CST", type: "reversed" },
    { question: "I often forget to put things back in their proper place", dimension: "CST", type: "reversed" },
    { question: "I do things in a haphazard way", dimension: "CST", type: "reversed" },

    // EXT – Extraversion
    { question: "I am the life of the party", dimension: "EXT", type: "normal" },
    { question: "I feel comfortable around people", dimension: "EXT", type: "normal" },
    { question: "I start conversations easily", dimension: "EXT", type: "normal" },
    { question: "I talk to a lot of different people at parties", dimension: "EXT", type: "normal" },
    { question: "I feel at ease in social situations", dimension: "EXT", type: "normal" },
    { question: "I don't talk a lot", dimension: "EXT", type: "reversed" },
    { question: "I don't like to draw attention to myself", dimension: "EXT", type: "reversed" },
    { question: "I keep in the background", dimension: "EXT", type: "reversed" },
    { question: "I have little to say", dimension: "EXT", type: "reversed" },
    { question: "I prefer to be alone", dimension: "EXT", type: "reversed" },

    // AGR – Agreeableness
    { question: "I sympathize with others' feelings", dimension: "AGR", type: "normal" },
    { question: "I take time out for others", dimension: "AGR", type: "normal" },
    { question: "I make people feel at ease", dimension: "AGR", type: "normal" },
    { question: "I am interested in people", dimension: "AGR", type: "normal" },
    { question: "I feel others' emotions", dimension: "AGR", type: "normal" },
    { question: "I insult people", dimension: "AGR", type: "reversed" },
    { question: "I am not interested in others' problems", dimension: "AGR", type: "reversed" },
    { question: "I find it hard to forgive others", dimension: "AGR", type: "reversed" },
    { question: "I am critical of others", dimension: "AGR", type: "reversed" },
    { question: "I hold grudges", dimension: "AGR", type: "reversed" },

    // NRO – Neuroticism
    { question: "I get stressed out easily", dimension: "NRO", type: "normal" },
    { question: "I worry about things", dimension: "NRO", type: "normal" },
    { question: "I have frequent mood swings", dimension: "NRO", type: "normal" },
    { question: "I get irritated easily", dimension: "NRO", type: "normal" },
    { question: "I often feel blue", dimension: "NRO", type: "normal" },
    { question: "I am relaxed most of the time", dimension: "NRO", type: "reversed" },
    { question: "I seldom feel sad", dimension: "NRO", type: "reversed" },
    { question: "I rarely get irritated", dimension: "NRO", type: "reversed" },
    { question: "I feel emotionally stable", dimension: "NRO", type: "reversed" },
    { question: "I remain calm under pressure", dimension: "NRO", type: "reversed" }
];

export let opnQuestions: number[] = [];
export let cstQuestions: number[] = [];
export let extQuestions: number[] = [];
export let agrQuestions: number[] = [];
export let nroQuestions: number[] = [];

export let askedQuestions: number[] = []; 



export function genRandomQuestion(index: number): Question {
    return questionsList[index];
}

export function genRandomIndex(): Question | null {
    if (askedQuestions.length === questionsList.length) {
        return null; 
    }

    while (true) {
        const randomIndex: number = Math.floor(Math.random() * questionsList.length);
        
        if (!askedQuestions.includes(randomIndex)) {
            askedQuestions.push(randomIndex);
            return genRandomQuestion(randomIndex);
        }
    }
}


export function calculateDimensionScore(rawChoice: number, question: Question): DimensionScoreResult {
    // Score reversal map
    const r: { [key: number]: number } = {
        1: 5,
        2: 4,
        3: 3,
        4: 2,
        5: 1
    };

    let trueScore: number;

    if (question.type === 'normal') {
        trueScore = rawChoice;
    } else {
        trueScore = r[rawChoice];
    };

    return { dimension: question.dimension, score: trueScore };
}


export function updateUserScore(arg: DimensionScoreResult): void {
    switch(arg.dimension) {
        case "OPN":
            opnQuestions.push(arg.score);
            break;
        case "CST":
            cstQuestions.push(arg.score);
            break;
        case "EXT":
            extQuestions.push(arg.score);
            break;
        case "AGR":
            agrQuestions.push(arg.score);
            break;
        case "NRO":
            nroQuestions.push(arg.score);
            break;
        default:
            console.error("Error: Invalid dimension received!");
    }
}


// function promptUser(): boolean {
//     const questionObj = genRandomIndex();

//     if (!questionObj) {
//         return false;
//     }

//     let userScore: number = 0;
//     let isValid: boolean = false;

//     // Input Validation Loop
//     while (!isValid) {
//         const userEntryStr: string = prompt(questionObj.question + " (Score 1-5): \n") || "";
//         const userEntry: number = Number(userEntryStr);

//         // Check if it's a valid number between 1 and 5
//         if (!isNaN(userEntry) && userEntry >= 1 && userEntry <= 5 && userEntryStr.trim().length > 0) {
//             userScore = userEntry;
//             isValid = true;
//         } else {
//             console.log("⚠️ Invalid input. Please enter a number between 1 and 5.");
//         }
//     }
    
//     updateUserScore(calculateDimensionScore(userScore, questionObj));
    
//     return true;
// }

// function prompUser(): boolean {
    
// }

// function main(): void {
//     while (askedQuestions.length < questionsList.length) {
//         promptUser();
//         console.log(`\n✅ Your progress: ${askedQuestions.length} / ${questionsList.length} questions answered.\n`);
//     };

//     console.log("--- Quiz Complete! ---");
// }


export const completeModel: UserScores = {
    "OPN": 0,
    "CST": 0,
    "EXT": 0,
    "AGR": 0,
    "NRO": 0
};

export function calculateDimensionAverage(choicesArr: number[]): number {
    if (choicesArr.length === 0) return 0; 
    const total: number = choicesArr.reduce((sum, curr) => sum + curr, 0); 
    return total / choicesArr.length;
}

// function calculateSimilarityScore(firstInput: number, secondInput: number): number {
//     return (1 - Math.abs(firstInput - secondInput)/4);
// }


export const user1Profile: UserScores = { ...completeModel }; // Use spread operator for type-safe clone

if (opnQuestions.length === 10) {
    
    user1Profile.OPN = calculateDimensionAverage(opnQuestions);
    user1Profile.CST = calculateDimensionAverage(cstQuestions);
    user1Profile.EXT = calculateDimensionAverage(extQuestions);
    user1Profile.AGR = calculateDimensionAverage(agrQuestions);
    user1Profile.NRO = calculateDimensionAverage(nroQuestions);

    console.log("\n--- USER 1 FINAL PROFILE SCORES ---");
    console.log(user1Profile);
} else {
    console.log("\nCannot calculate final profile. Quiz is incomplete or data is missing.");
}